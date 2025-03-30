import mongoose from 'mongoose';

const QuestionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
  },
  options: {
    type: [String],
    required: true,
  },
  correctAnswer: {
    type: String,
    required: true,
  },
  subject: {
    type: String,
    required: true,
    enum: ['mathematics', 'physics', 'chemistry'],
  },
});

export default mongoose.models.Question || mongoose.model('Question', QuestionSchema);