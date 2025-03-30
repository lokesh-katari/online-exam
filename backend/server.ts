import express from "express";
import { Server } from "socket.io";
import http from "http";
import cors from "cors";
import dotenv from "dotenv";
import dbConnect from "./db";
import examRoutes from "./routes/examRoutes";
import { setupSocketConnection } from "./socket";

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*", methods: ["GET", "POST"] },
});

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
dbConnect().then(() => console.log("Connected to MongoDB"));

// Setup socket connection
setupSocketConnection(io);

// Routes
app.use("/api/exams", examRoutes);

app.get("/", (req, res) => {
  res.send("Exam API is running");
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
