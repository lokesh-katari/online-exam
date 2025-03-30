import { NextRequest, NextResponse } from "next/server";
import { Server } from "socket.io";
import { createServer } from "http";

// Singleton to prevent multiple initializations
let io: Server | null = null;

export async function GET(request: NextRequest) {
  // If socket is already initialized, return early
  if (io) {
    return NextResponse.json(
      { message: "Socket already initialized" },
      { status: 200 }
    );
  }

  try {
    // Create HTTP server
    const httpServer = createServer();

    // Initialize Socket.io server
    io = new Server(httpServer, {
      path: "/api/socket",
      addTrailingSlash: false,
      cors: {
        origin: process.env.NEXT_PUBLIC_SITE_URL || "*",
        methods: ["GET", "POST"],
      },
    });

    // Socket connection event handlers
    io.on("connection", (socket) => {
      console.log("Client connected:", socket.id);

      // Exam submission event
      socket.on("exam-submit", async (data) => {
        console.log("Exam submitted:", data);

        // Broadcast to admin dashboard
        socket.broadcast.emit("new-exam-submission", {
          ...data,
          socketId: socket.id,
        });

        // Optional: You could add additional processing here
        // Like saving to database, triggering notifications, etc.
      });

      // Handle disconnection
      socket.on("disconnect", () => {
        console.log("Client disconnected:", socket.id);
      });
    });

    // Start the HTTP server
    httpServer.listen(0); // Let OS assign a random port

    return NextResponse.json(
      {
        message: "Socket initialized successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Socket initialization error:", error);
    return NextResponse.json(
      {
        message: "Socket initialization failed",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};
