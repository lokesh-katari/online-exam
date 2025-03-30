"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useSocket } from "@/hooks/useSocket";

interface Question {
  _id: string;
  question: string;
  options: string[];
  subject: string;
}

export default function ExamPage() {
  const { socket } = useSocket();
  const [questions, setQuestions] = useState<Record<string, Question[]>>({
    mathematics: [],
    physics: [],
    chemistry: [],
  });
  const [currentSection, setCurrentSection] = useState("mathematics");
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeLeft, setTimeLeft] = useState(180 * 60); // 3 hours in seconds
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [studentId, setStudentId] = useState<string>("");

  useEffect(() => {
    // Generate or retrieve student ID
    const storedStudentId = localStorage.getItem("studentId");
    if (storedStudentId) {
      setStudentId(storedStudentId);
    } else {
      const newStudentId = `student-${Date.now()}`;
      localStorage.setItem("studentId", newStudentId);
      setStudentId(newStudentId);
    }

    // Emit exam start event when component mounts
    if (socket) {
      socket.emit("start-exam", {
        studentId,
        email: `${studentId}@example.com`, // You might want to replace this with actual user email
      });
    }

    // Fetch questions
    const fetchQuestions = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/exams/questions"
        );
        const data = await response.json();
        setQuestions(data);
      } catch (error) {
        console.error("Error fetching questions:", error);
        toast({
          title: "Fetch Error",
          description: "Unable to load exam questions",
          variant: "destructive",
        });
      }
    };
    fetchQuestions();

    // Timer setup
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0) {
          clearInterval(timer);
          submitExam();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Cleanup
    return () => {
      clearInterval(timer);
    };
  }, [socket]);

  const submitExam = async () => {
    if (isSubmitted) return;

    try {
      // Prepare submission data
      const submissionData = {
        userId: studentId,
        answers,
        totalQuestions: Object.keys(questions).reduce(
          (total, subject) => total + questions[subject].length,
          0
        ),
        timestamp: new Date(),
      };

      // HTTP submission
      const httpResponse = await fetch(
        "http://localhost:5000/api/exams/submit",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(submissionData),
        }
      );

      // Socket submission event
      if (socket) {
        socket.emit("exam-submit", submissionData);
      }

      // Handle response
      if (httpResponse.ok) {
        setIsSubmitted(true);
        toast({
          title: "Exam Submitted",
          description: "Your exam has been successfully submitted",
        });
      } else {
        throw new Error("Submission failed");
      }
    } catch (error) {
      console.error("Error submitting exam:", error);
      toast({
        title: "Submission Error",
        description: "Unable to submit exam. Please try again.",
        variant: "destructive",
      });
    }
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="container mx-auto p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">AP EAMCET Examination</h1>
        <div className="text-2xl font-mono">{formatTime(timeLeft)}</div>
      </div>

      <Tabs value={currentSection} onValueChange={setCurrentSection}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="mathematics">Mathematics</TabsTrigger>
          <TabsTrigger value="physics">Physics</TabsTrigger>
          <TabsTrigger value="chemistry">Chemistry</TabsTrigger>
        </TabsList>

        {Object.entries(questions).map(([subject, subjectQuestions]) => (
          <TabsContent key={subject} value={subject}>
            <div className="space-y-8">
              {subjectQuestions.map((question, index) => (
                <Card key={question._id} className="p-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">
                      {index + 1}. {question.question}
                    </h3>
                    <RadioGroup
                      value={answers[question._id]}
                      onValueChange={(value) => {
                        setAnswers((prev) => ({
                          ...prev,
                          [question._id]: value,
                        }));
                        if (socket) {
                          socket.emit("exam-progress", {
                            studentId,
                            questionId: question._id,
                            answer: value,
                          });
                        }
                      }}
                    >
                      {question.options.map((option, optionIndex) => (
                        <div
                          key={optionIndex}
                          className="flex items-center space-x-2"
                        >
                          <RadioGroupItem
                            value={option}
                            id={`${question._id}-${optionIndex}`}
                          />
                          <Label htmlFor={`${question._id}-${optionIndex}`}>
                            {option}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      <div className="mt-8 flex justify-end">
        <Button onClick={submitExam} size="lg">
          Submit Exam
        </Button>
      </div>
    </div>
  );
}
