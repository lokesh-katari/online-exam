import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Question from "@/lib/models/Question";

export async function POST(req: Request) {
  try {
    await dbConnect();

    const { questions } = await req.json();

    // return;

    if (!Array.isArray(questions) || questions.length === 0) {
      return NextResponse.json(
        { error: "Invalid questions data format" },
        { status: 400 }
      );
    }

    // Validate and transform the CSV data
    const transformedQuestions = questions.map((q: any) =>
      q.question !== ""
        ? {
            question: q.question,
            options: [q.option1, q.option2, q.option3, q.option4],
            correctAnswer: q.correctAnswer,
            subject: q.subject.toLowerCase(),
          }
        : null
    );

    console.log("questions", transformedQuestions);

    await Question.insertMany(transformedQuestions);
    return NextResponse.json({ success: true });
    // Insert questions into the database
  } catch (error) {
    console.error("Error uploading questions:", error);
    return NextResponse.json(
      { error: error || "Failed to upload questions" },
      { status: 500 }
    );
  }
}
