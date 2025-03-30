import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Question from '@/lib/models/Question';
import ExamResult from '@/lib/models/ExamResult';

export async function POST(req: Request) {
  try {
    await dbConnect();

    const { answers } = await req.json();
    const questions = await Question.find({
      _id: { $in: Object.keys(answers) },
    }).lean();

    // Calculate scores by subject
    const scores = questions.reduce(
      (acc, question) => {
        if (answers[question._id] === question.correctAnswer) {
          acc[question.subject] += 1;
          acc.total += 1;
        }
        return acc;
      },
      { mathematics: 0, physics: 0, chemistry: 0, total: 0 }
    );

    // Save exam result
    const result = await ExamResult.create({
      userId: 'user_id', // Replace with actual user ID from authentication
      score: {
        mathematics: scores.mathematics,
        physics: scores.physics,
        chemistry: scores.chemistry,
      },
      totalScore: scores.total,
    });

    return NextResponse.json({ result });
  } catch (error) {
    console.error('Error submitting exam:', error);
    return NextResponse.json(
      { error: 'Failed to submit exam' },
      { status: 500 }
    );
  }
}