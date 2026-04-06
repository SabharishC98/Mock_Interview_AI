// server/src/models/Interview.model.js
import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  role: { type: String, enum: ['user', 'assistant'], required: true },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

const questionSchema = new mongoose.Schema({
  text: String,
  type: String,
  isCodeQuestion: { type: Boolean, default: false },
  codeSnippet: String,
});

const codeSubmissionSchema = new mongoose.Schema({
  questionIndex: Number,
  code: String,
  language: String,
  evaluation: mongoose.Schema.Types.Mixed,
});

const interviewSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  role: { type: String, required: true },
  difficulty: { type: String, default: 'medium' },
  status: { type: String, enum: ['in-progress', 'completed'], default: 'in-progress' },
  questions: [questionSchema],
  messages: [messageSchema],
  codeSubmissions: [codeSubmissionSchema],
  currentQuestion: { type: Number, default: 1 },
  totalQuestions: { type: Number, default: 5 },
  overallScore: Number,
  feedback: mongoose.Schema.Types.Mixed,
}, { timestamps: true });

export default mongoose.model('Interview', interviewSchema);