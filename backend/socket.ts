import { Server } from "socket.io";

// In-memory tracking objects
const examStats = {
  totalStudents: 0,
  studentsWritingExam: 0,
  onlineStudents: 0,
  studentDetails: new Map<
    string,
    {
      id: string;
      email: string;
      isWritingExam: boolean;
    }
  >(),
};

export function setupSocketConnection(io: Server) {
  io.on("connection", (socket) => {
    console.log(`Client connected: ${socket.id}`);

    // Event to mark student as starting exam
    socket.on("start-exam", (userData) => {
      // Add or update student in the tracking object

      console.log("start-exam hit event", socket.id);

      examStats.studentDetails.set(socket.id, {
        id: socket.id,
        email: userData.email,
        isWritingExam: true,
      });

      // Increment counters
      examStats.totalStudents++;
      examStats.studentsWritingExam++;
      examStats.onlineStudents++;

      // Broadcast updated stats
      io.emit("exam-stats-update", examStats, "from start exams");

      console.log(
        `Student ${userData.email} started exam. Current stats:`,
        examStats
      );
    });

    // Handle exam submission
    socket.on("exam-submit", async (examData) => {
      console.log("Exam submitted:", examData);

      // Update student status
      const studentEntry = examStats.studentDetails.get(socket.id);
      if (studentEntry) {
        studentEntry.isWritingExam = false;
        examStats.studentsWritingExam--;
      }

      // Notify all clients about new submission and updated stats
      io.emit("new-exam-submission", examData);
      io.emit("exam-stats-update", examStats, "from exam submit");
    });

    // Handle user login event
    socket.on("user-logged-in", (userData) => {
      console.log("User logged in:", userData);

      // Add or update student in the tracking object
      examStats.studentDetails.set(socket.id, {
        id: socket.id,
        email: userData.email,
        isWritingExam: false,
      });

      // Increment online students
      examStats.onlineStudents++;

      // Broadcast user activity and updated stats
      io.emit("user-activity", {
        message: `${userData.email} has logged in.`,
        stats: examStats,
      });
    });
    socket.on("exam-progress", (progressData) => {
      // Optional: Track student progress
      console.log("Student exam progress:", progressData);
    });

    // Handle disconnection
    socket.on("disconnect", () => {
      console.log(`Client disconnected: ${socket.id}`);

      // Remove student from tracking and adjust counters
      const studentEntry = examStats.studentDetails.get(socket.id);
      if (studentEntry) {
        if (studentEntry.isWritingExam) {
          examStats.studentsWritingExam--;
        }
        examStats.onlineStudents--;
        examStats.studentDetails.delete(socket.id);
      }

      // Broadcast updated stats
      io.emit("exam-stats-update", examStats);
    });

    // New event to request current exam stats
    socket.on("get-exam-stats", () => {
      socket.emit("exam-stats-update", examStats);
    });
  });
}
