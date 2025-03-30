import express from "express";
import {
  getQuestions,
  submitExam,
  getUserResults,
} from "../controllers/examControllers";

const router = express.Router();

router.get("/questions", getQuestions);
router.post("/submit", submitExam);
router.get("/results", getUserResults);

export default router;
