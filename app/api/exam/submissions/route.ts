import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Question from "@/lib/models/Question";
import ExamResult from "@/lib/models/ExamResult";
export async function GET(request: NextRequest) {
  try {
    // Ensure database connection
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const userId = searchParams.get("userId");

    // Build query
    const query = userId ? { userId } : {};

    // Pagination
    const skip = (page - 1) * limit;

    // Fetch results
    const results = await ExamResult.find(query)
      .sort({ completedAt: -1 })
      .skip(skip)
      .limit(limit);

    // Count total results
    const total = await ExamResult.countDocuments(query);

    return NextResponse.json(
      {
        results,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalResults: total,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching exam results:", error);
    return NextResponse.json(
      {
        message: "Failed to fetch exam results",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
