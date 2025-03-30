import React, { useEffect, useState } from "react";
import { Users, BookOpen, CheckCircle, AlertCircle } from "lucide-react";
import { useSocket } from "../hooks/useSocket";

// Compact Stats Card
export const ExamStatsCompact: React.FC = () => {
  const { examStats, isConnected } = useSocket();

  if (!isConnected) {
    return (
      <div className="bg-yellow-100 text-yellow-800 p-2 rounded flex items-center">
        <AlertCircle className="mr-2" />
        Disconnected from exam server
      </div>
    );
  }

  return (
    <div className="bg-white shadow-md rounded-lg p-4 grid grid-cols-3 gap-2">
      <div className="flex items-center">
        <Users className="mr-2 text-blue-500" />
        <span>{examStats.totalStudents} Total</span>
      </div>
      <div className="flex items-center">
        <BookOpen className="mr-2 text-green-500" />
        <span>{examStats.studentsWritingExam} Writing</span>
      </div>
      <div className="flex items-center">
        <CheckCircle className="mr-2 text-purple-500" />
        <span>{examStats.onlineStudents} Online</span>
      </div>
    </div>
  );
};

// Detailed Stats Dashboard
export const ExamStatsDashboard: React.FC = () => {
  const { examStats, isConnected } = useSocket();

  if (!isConnected) {
    return (
      <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
        <AlertCircle className="inline-block mr-2 text-red-500" />
        Unable to connect to exam monitoring system
      </div>
    );
  }

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 space-y-4">
      <h2 className="text-xl font-semibold mb-4">Exam Monitoring Dashboard</h2>

      <div className="grid md:grid-cols-3 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-center mb-2">
            <Users className="mr-2 text-blue-600" />
            <h3 className="font-medium">Total Students</h3>
          </div>
          <p className="text-3xl font-bold text-blue-700">
            {examStats.totalStudents}
          </p>
        </div>

        <div className="bg-green-50 p-4 rounded-lg">
          <div className="flex items-center mb-2">
            <BookOpen className="mr-2 text-green-600" />
            <h3 className="font-medium">Writing Exam</h3>
          </div>
          <p className="text-3xl font-bold text-green-700">
            {examStats.studentsWritingExam}
          </p>
        </div>

        <div className="bg-purple-50 p-4 rounded-lg">
          <div className="flex items-center mb-2">
            <CheckCircle className="mr-2 text-purple-600" />
            <h3 className="font-medium">Online</h3>
          </div>
          <p className="text-3xl font-bold text-purple-700">
            {examStats.onlineStudents}
          </p>
        </div>
      </div>

      <div className="mt-4 p-4 bg-gray-50 rounded-lg">
        <h4 className="font-medium mb-2">Exam Progress</h4>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className="bg-blue-600 h-2.5 rounded-full"
            style={{
              width: `${
                (examStats.studentsWritingExam /
                  Math.max(examStats.totalStudents, 1)) *
                100
              }%`,
            }}
          ></div>
        </div>
        <p className="text-sm text-gray-600 mt-2">
          {examStats.studentsWritingExam} out of {examStats.totalStudents}{" "}
          students are currently writing the exam
        </p>
      </div>
    </div>
  );
};

// Real-time Student List (Optional)
export const ExamStudentList: React.FC = () => {
  const { socket, examStats } = useSocket();
  const [studentList, setStudentList] = useState<any[]>([]);

  useEffect(() => {
    if (socket) {
      socket.on("student-list-update", (students) => {
        setStudentList(students);
      });
    }
  }, [socket]);

  return (
    <div className="bg-white shadow-md rounded-lg p-4">
      <h3 className="text-lg font-semibold mb-4">
        Students ({studentList.length})
      </h3>
      <ul className="space-y-2">
        {studentList.map((student) => (
          <li
            key={student.id}
            className="flex justify-between items-center p-2 bg-gray-50 rounded"
          >
            <span>{student.email}</span>
            <span className="text-sm text-gray-500">
              {student.isWritingExam ? "Exam In Progress" : "Online"}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};
