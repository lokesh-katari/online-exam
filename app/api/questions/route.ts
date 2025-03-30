import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Question from '@/lib/models/Question';

export async function GET() {
  try {
    await dbConnect();

    const questions = await Question.find({}).lean();

    // Group questions by subject
    const groupedQuestions = questions.reduce(
      (acc, question) => {
        if (!acc[question.subject]) {
          acc[question.subject] = [];
        }
        acc[question.subject].push(question);
        return acc;
      },
      { mathematics: [], physics: [], chemistry: [] }
    );

    return NextResponse.json(groupedQuestions);
  } catch (error) {
    console.error('Error fetching questions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch questions' },
      { status: 500 }
    );
  }
}