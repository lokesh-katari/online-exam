import mongoose from 'mongoose';

const ExamResultSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  score: {
    mathematics: {
      type: Number,
      default: 0,
    },
    physics: {
      type: Number,
      default: 0,
    },
    chemistry: {
      type: Number,
      default: 0,
    },
  },
  totalScore: {
    type: Number,
    default: 0,
  },
  completedAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.ExamResult || mongoose.model('ExamResult', ExamResultSchema);