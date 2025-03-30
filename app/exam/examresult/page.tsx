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
import { Button } from "@/components/ui/button";

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
  const [results, setResults] = useState<ExamResult[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await fetch(`/api/exam/results?page=${page}&limit=10`);
        const data = await response.json();

        setResults(data.results);
        setTotalPages(data.pagination.totalPages);
      } catch (error) {
        console.error("Failed to fetch exam results", error);
      }
    };

    fetchResults();
  }, [page]);

  const calculateGrade = (score: number) => {
    if (score >= 90) return "A+";
    if (score >= 80) return "A";
    if (score >= 70) return "B";
    if (score >= 60) return "C";
    if (score >= 50) return "D";
    return "F";
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-4xl font-bold mb-8">Exam Results</h1>

      <Card>
        <CardHeader>
          <CardTitle>Student Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student ID</TableHead>
                <TableHead>Mathematics</TableHead>
                <TableHead>Physics</TableHead>
                <TableHead>Chemistry</TableHead>
                <TableHead>Total Score</TableHead>
                <TableHead>Grade</TableHead>
                <TableHead>Completed At</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {results.map((result) => (
                <TableRow key={result._id}>
                  <TableCell>{result.userId}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        result.score.mathematics >= 60
                          ? "default"
                          : "destructive"
                      }
                    >
                      {result.score.mathematics}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        result.score.physics >= 60 ? "default" : "destructive"
                      }
                    >
                      {result.score.physics}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        result.score.chemistry >= 60 ? "default" : "destructive"
                      }
                    >
                      {result.score.chemistry}
                    </Badge>
                  </TableCell>
                  <TableCell>{result.totalScore}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        calculateGrade(result.totalScore) === "F"
                          ? "destructive"
                          : "secondary"
                      }
                    >
                      {calculateGrade(result.totalScore)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(result.completedAt).toLocaleString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="flex justify-between items-center mt-4">
            <Button
              onClick={() => setPage((prev) => Math.max(1, prev - 1))}
              disabled={page === 1}
            >
              Previous
            </Button>
            <span>
              Page {page} of {totalPages}
            </span>
            <Button
              onClick={() => setPage((prev) => prev + 1)}
              disabled={page === totalPages}
            >
              Next
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
