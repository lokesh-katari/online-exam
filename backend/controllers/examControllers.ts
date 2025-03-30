import { type Request, type Response } from "express";
import Question from "../models/Question";
import ExamResult from "../models/ExamResult";

/**
 * @desc Get all questions
 * @route GET /api/exams/questions
 */
export const getQuestions = async (req: Request, res: Response) => {
  try {
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

    res.status(200).json(groupedQuestions);
  } catch (error) {
    console.error("Error fetching questions:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * @desc Submit exam results
 * @route POST /api/exams/submit
 */
export const submitExam = async (req: Request, res: Response) => {
  try {
    const { userId, answers } = req.body;

    // Fetch all questions
    const questions = await Question.find();

    let score = { mathematics: 0, physics: 0, chemistry: 0 };
    let totalScore = 0;

    // Calculate score
    questions.forEach((question) => {
      if (answers[question._id] === question.correctAnswer) {
        score[question.subject as keyof typeof score]++;
        totalScore++;
      }
    });

    // Save exam result
    const examResult = new ExamResult({
      userId,
      score,
      totalScore,
    });

    await examResult.save();

    res
      .status(200)
      .json({ message: "Exam submitted successfully", examResult });
  } catch (error) {
    console.error("Error submitting exam:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// /**
//  * @desc Get user exam results
//  * @route GET /api/exams/results/:userId
//  */
export const getUserResults = async (req: Request, res: Response) => {
  try {
    // Parse page and limit from query parameters with default values
    const page = parseInt((req.query.page as string) || "1", 10);
    const limit = parseInt((req.query.limit as string) || "10", 10);
    const userId = req.query.userId as string;

    // Build query
    const query = userId ? { userId } : {};

    // Pagination
    const skip = (page - 1) * limit;

    // Fetch results
    const [results, total] = await Promise.all([
      ExamResult.find(query).sort({ completedAt: -1 }).skip(skip).limit(limit),
      ExamResult.countDocuments(query),
    ]);

    return res.status(200).json({
      results,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalResults: total,
      },
    });
  } catch (error) {
    console.error("Error fetching results:", error);
    res.status(500).json({ message: "Server error" });
  }
};
