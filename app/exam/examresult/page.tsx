"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useWindowSize } from "react-use";
import { Button } from "@/components/ui/button";
import Confetti from "react-confetti";
import { useParams, useSearchParams } from "next/navigation";

interface ExamResult {
  _id: string;
  userId: string;
  score: {
    mathematics: number;
    physics: number;
    chemistry: number;
  };
  totalScore: number;
  completedAt: Date;
}

export default function ExamResultsDashboard() {
  const [results, setResults] = useState<ExamResult>();
  const [grade, setGrade] = useState("A");
  const params = useSearchParams();
  const { width, height } = useWindowSize();
  useEffect(() => {
    const studentId = params?.get("studentId");
    const fetchResults = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/exams/result/${studentId}`
        );
        const data = await response.json();
        console.log(data);

        setResults(data.result);
        setGrade(calculateGrade(data.result.totalScore));
        // setTotalPages(data.pagination.totalPages);
      } catch (error) {
        console.error("Failed to fetch exam results", error);
      }
    };

    fetchResults();
  }, []);

  const calculateGrade = (score: number) => {
    if (score >= 9) return "A+";
    if (score >= 8) return "A";
    if (score >= 7) return "B";
    if (score >= 6) return "C";
    if (score >= 5) return "D";
    return "F";
  };

  return (
    <div className="container mx-auto p-6">
      {results && (
        <Confetti
          recycle={false}
          numberOfPieces={500}
          height={height}
          width={width}
        />
      )}

      <Card
        className={`w-full max-w-2xl mx-auto ${
          grade !== "F" ? "border-green-500" : "border-red-500"
        } border-2`}
      >
        <CardHeader>
          <CardTitle className="text-center text-2xl">Exam Results</CardTitle>
        </CardHeader>
        <CardContent>
          {results ? (
            <div className="space-y-6">
              <div className="text-center">
                <span className="text-6xl font-bold block mb-2">
                  {results?.totalScore}
                </span>
                <span className="text-3xl font-semibold block mb-4">
                  Grade: {grade}
                </span>
                {grade !== "F" ? (
                  <div className="bg-green-100 text-green-800 p-4 rounded-md">
                    <p className="text-xl font-medium">
                      Congratulations! You passed the exam.
                    </p>
                  </div>
                ) : (
                  <div className="bg-red-100 text-red-800 p-4 rounded-md">
                    <p className="text-xl font-medium">
                      You did not pass the exam. Please consider retaking it.
                    </p>
                  </div>
                )}
              </div>

              <div className="mt-8">
                <h3 className="text-lg font-medium mb-2">Score Summary</h3>
                <p>Correct Answers: {results.totalScore} out of 30</p>
                <p>
                  Submitted on: {new Date(results.completedAt).toLocaleString()}
                </p>
              </div>

              <div className="flex justify-center mt-6">
                <button
                  // onClick={() => router.push("/dashboard")}
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                >
                  Return to Dashboard
                </button>
                {grade === "F" && (
                  <button
                    // onClick={() => router.push("/exam")}
                    className="ml-4 px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
                  >
                    Retake Exam
                  </button>
                )}
              </div>
            </div>
          ) : (
            <p>No results found for this student ID.</p>
          )}
        </CardContent>
      </Card>
    </div>

    // <></>
  );
}
