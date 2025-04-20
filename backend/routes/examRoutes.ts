import express from "express";
import {
  getQuestions,
  submitExam,
  getUserResults,
  getstudentResults,
} from "../controllers/examControllers";

const router = express.Router();

router.get("/questions", getQuestions);
router.post("/submit", submitExam);
router.get("/results", getUserResults);
router.get("/result/:studentId", getstudentResults);

export default router;
