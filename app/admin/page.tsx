// // "use client";

// // import { useState } from 'react';
// // import { Button } from '@/components/ui/button';
// // import { Input } from '@/components/ui/input';
// // import { Card } from '@/components/ui/card';
// // import { Upload, Users } from 'lucide-react';
// // import { useToast } from "@/hooks/use-toast";
// // import Papa from 'papaparse';

// // export default function AdminDashboard() {
// //   const [uploading, setUploading] = useState(false);
// //   const [students, setStudents] = useState([]);
// //   const { toast } = useToast();

// //   const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
// //     const file = event.target.files?.[0];
// //     if (!file) return;

// //     setUploading(true);

// //     Papa.parse(file, {
// //       complete: async (results) => {
// //         try {
// //           const response = await fetch('/api/questions/upload', {
// //             method: 'POST',
// //             headers: {
// //               'Content-Type': 'application/json',
// //             },
// //             body: JSON.stringify({ questions: results.data }),
// //           });

// //           if (!response.ok) {
// //             const error = await response.json();
// //             throw new Error(error.error || 'Failed to upload questions');
// //           }

// //           toast({
// //             title: "Success",
// //             description: "Questions uploaded successfully",
// //           });
// //         } catch (error) {
// //           console.error('Error uploading questions:', error);
// //           toast({
// //             title: "Error",
// //             description: error.message || "Failed to upload questions",
// //             variant: "destructive",
// //           });
// //         } finally {
// //           setUploading(false);
// //         }
// //       },
// //       header: true,
// //       error: (error) => {
// //         console.error('Error parsing CSV:', error);
// //         toast({
// //           title: "Error",
// //           description: "Failed to parse CSV file",
// //           variant: "destructive",
// //         });
// //         setUploading(false);
// //       },
// //     });
// //   };

// //   return (
// //     <div className="container mx-auto p-8">
// //       <h1 className="text-4xl font-bold mb-8">Admin Dashboard</h1>

// //       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
// //         <Card className="p-6">
// //           <h2 className="text-2xl font-semibold mb-4">Upload Questions</h2>
// //           <div className="space-y-4">
// //             <Input
// //               type="file"
// //               accept=".csv"
// //               onChange={handleFileUpload}
// //               disabled={uploading}
// //             />
// //             <Button disabled={uploading}>
// //               <Upload className="mr-2 h-4 w-4" />
// //               {uploading ? 'Uploading...' : 'Upload CSV'}
// //             </Button>
// //           </div>
// //         </Card>

// //         <Card className="p-6">
// //           <h2 className="text-2xl font-semibold mb-4">Active Students</h2>
// //           <div className="space-y-4">
// //             <div className="flex items-center justify-between">
// //               <Users className="h-8 w-8" />
// //               <span className="text-2xl font-bold">{students.length}</span>
// //             </div>
// //           </div>
// //         </Card>
// //       </div>

// //       {/* Real-time Student Progress */}
// //       <Card className="mt-8 p-6">
// //         <h2 className="text-2xl font-semibold mb-4">Student Progress</h2>
// //         <div className="overflow-x-auto">
// //           <table className="min-w-full divide-y divide-gray-200">
// //             <thead>
// //               <tr>
// //                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
// //                   Student
// //                 </th>
// //                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
// //                   Progress
// //                 </th>
// //                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
// //                   Status
// //                 </th>
// //               </tr>
// //             </thead>
// //             <tbody className="divide-y divide-gray-200">
// //               {/* Student progress rows will be populated here */}
// //             </tbody>
// //           </table>
// //         </div>
// //       </Card>
// //     </div>
// //   );
// // }

// "use client";

// import { useState, useEffect } from "react";
// import { io } from "socket.io-client";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { ScrollArea } from "@/components/ui/scroll-area";

// interface ExamSubmission {
//   studentId: string;
//   completedAt: Date;
//   answers: Record<string, string>;
//   socketId?: string;
//   totalScore?: number;
// }

// export default function AdminDashboard() {
//   const [submissions, setSubmissions] = useState<ExamSubmission[]>([]);
//   const [socket, setSocket] = useState(null);

//   useEffect(() => {
//     // Socket initialization
//     const socketIo = io({
//       path: "/api/socket",
//       reconnection: true,
//       reconnectionAttempts: 5,
//       reconnectionDelay: 1000,
//     });

//     // Connect socket
//     socketIo.on("connect", () => {
//       console.log("Admin dashboard socket connected");
//       setSocket(socketIo);
//     });

//     // Listen for new exam submissions
//     socketIo.on("new-exam-submission", (submission: ExamSubmission) => {
//       setSubmissions((prev) => [submission, ...prev]);
//     });

//     // Fetch initial submissions
//     const fetchSubmissions = async () => {
//       try {
//         const response = await fetch("http://localhost:5000/api/exams/results");
//         const data = await response.json();
//         setSubmissions(data.results);
//       } catch (error) {
//         console.error("Failed to fetch submissions", error);
//       }
//     };
//     fetchSubmissions();

//     // Cleanup
//     return () => {
//       socketIo.disconnect();
//     };
//   }, []);

//   return (
//     <div className="container mx-auto p-8">
//       <h1 className="text-4xl font-bold mb-8">Exam Submissions</h1>

//       <Card>
//         <CardHeader>
//           <CardTitle>Recent Submissions</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <ScrollArea className="h-[600px] w-full">
//             {submissions.map((submission, index) => (
//               <div
//                 key={index}
//                 className="border-b p-4 hover:bg-gray-50 transition-colors"
//               >
//                 <div className="flex justify-between items-center">
//                   <div>
//                     <p className="font-medium">
//                       Student: {submission.studentId}
//                     </p>
//                     <p className="text-sm text-gray-500">
//                       {new Date(submission.completedAt).toLocaleString()}
//                     </p>
//                     <p className="text-sm text-gray-500">
//                       Total Score :{submission.totalScore}
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </ScrollArea>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }F
"use client";
import { useState, useEffect } from "react";
import { useSocket } from "@/hooks/useSocket";
import { ExamStatsCompact, ExamStatsDashboard } from "@/components/examStats";
import { useToast } from "@/hooks/use-toast";
import Papa from "papaparse";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Upload, Users } from "lucide-react";
import { ScrollArea } from "@radix-ui/react-scroll-area";

interface ExamSubmission {
  studentId: string;
  completedAt: Date;
  answers: Record<string, string>;
  socketId?: string;
  totalScore?: number;
}
export default function Home() {
  const { socket, isConnected, examStats } = useSocket();
  const [submissions, setSubmissions] = useState<ExamSubmission[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const [uploading, setUploading] = useState(false);
  const [students, setStudents] = useState([]);
  const { toast } = useToast();

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/exams/results");
        const data = await response.json();
        setSubmissions(data.results);
      } catch (error) {
        console.error("Failed to fetch submissions", error);
      }
    };
    fetchSubmissions();
  }, [examStats]);

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);

    Papa.parse(file, {
      complete: async (results) => {
        try {
          const response = await fetch("/api/questions/upload", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ questions: results.data }),
          });

          if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || "Failed to upload questions");
          }

          toast({
            title: "Success",
            description: "Questions uploaded successfully",
          });
        } catch (error) {
          console.error("Error uploading questions:", error);
          toast({
            title: "Error",
            description: error.message || "Failed to upload questions",
            variant: "destructive",
          });
        } finally {
          setUploading(false);
        }
      },
      header: true,
      error: (error) => {
        console.error("Error parsing CSV:", error);
        toast({
          title: "Error",
          description: "Failed to parse CSV file",
          variant: "destructive",
        });
        setUploading(false);
      },
    });
  };
  // Hardcoded credentials
  const validCredentials = {
    email: "admin@example.com",
    password: "password123",
  };

  useEffect(() => {
    if (
      localStorage.getItem("email") === validCredentials.email &&
      localStorage.getItem("pass") === validCredentials.password
    ) {
      setIsAuthenticated(true);
    }
  }, []);
  const handleLogin = (e: any) => {
    e.preventDefault();

    if (
      email === validCredentials.email &&
      password === validCredentials.password
    ) {
      setIsAuthenticated(true);
      localStorage.setItem("email", email);
      localStorage.setItem("pass", password);
      setError("");
    } else {
      setError("Invalid credentials. Please try again.");
    }
  };

  // const startExam = () => {
  //   socket?.emit("start-exam", { email: "student@example.com" });
  // };

  // If user is not authenticated, show login form
  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
          <div className="text-center">
            <h1 className="text-2xl font-bold">Exam Stats Dashboard</h1>
            <p className="mt-2 text-gray-600">Please sign in to continue</p>
          </div>

          {error && (
            <div className="p-4 text-sm text-red-700 bg-red-100 rounded-md">
              {error}
            </div>
          )}

          <form className="mt-8 space-y-6" onSubmit={handleLogin}>
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm"
                  placeholder="admin@example.com"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm"
                  placeholder="password123"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
              >
                Sign in
              </button>
            </div>
          </form>

          <div className="mt-4 text-sm text-center text-gray-500">
            <p>Use the following credentials:</p>
            <p>Email: admin@example.com</p>
            <p>Password: password123</p>
          </div>
        </div>
      </div>
    );
  }

  // If user is authenticated, show the dashboard
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Exam Stats Dashboard</h1>
        <button
          onClick={() => setIsAuthenticated(false)}
          className="px-4 py-2 text-sm text-white bg-gray-600 rounded hover:bg-gray-700"
        >
          Logout
        </button>
      </div>

      <div className="mb-6">
        <ExamStatsCompact />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">Upload Questions</h2>
          <div className="space-y-4">
            {" "}
            <Input
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              disabled={uploading}
            />
            <Button disabled={uploading}>
              <Upload className="mr-2 h-4 w-4" />
              {uploading ? "Uploading..." : "Upload CSV"}
            </Button>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">Active Students</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Users className="h-8 w-8" />
              <span className="text-2xl font-bold">
                {examStats.onlineStudents}
              </span>
            </div>
          </div>
        </Card>
      </div>
      <div className="mb-6">
        <ExamStatsDashboard />
      </div>

      {/* <button
        onClick={startExam}
        className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
      >
        Start Exam
      </button> */}
      <div className="container mx-auto p-8">
        <h1 className="text-4xl font-bold mb-8">Exam Submissions</h1>
        <Card>
          <CardHeader>
            <CardTitle>Recent Submissions</CardTitle>{" "}
          </CardHeader>{" "}
          <CardContent>
            {" "}
            <ScrollArea className="h-full w-full">
              {submissions.map((submission, index) => (
                <div
                  key={index}
                  className="border-b p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">
                        Student: {submission.studentId}
                      </p>
                      <p className="text-sm text-gray-500">
                        {new Date(submission.completedAt).toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-500">
                        Total Score :{submission.totalScore}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
      {/* <div className="mt-4">
        <p>Socket Status: {isConnected ? "Connected" : "Disconnected"}</p>
      </div> */}
    </div>
  );
}
