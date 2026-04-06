// server/src/services/interview.service.js
import Interview from '../models/Interview.model.js';
import { askGemini } from './gemini.service.js';
import { generateAudio } from './murf.service.js';
import { parseGeminiJSON } from '../utils/prompts.utils.js';
import {
  GENERATE_QUESTIONS_PROMPT, INTERVIEW_GREETING_PROMPT,
  FOLLOW_UP_PROMPT, FEEDBACK_PROMPT, EVALUATE_CODE_PROMPT,
  buildConversationHistory,
} from '../constants/prompts.js';

export const startInterview = async (userId, role, resumeText, totalQuestions, userName) => {
  const questionsRaw = await askGemini(GENERATE_QUESTIONS_PROMPT(role, resumeText, totalQuestions));
  const questions = parseGeminiJSON(questionsRaw);

  const greetingText = await askGemini(INTERVIEW_GREETING_PROMPT(userName, role));
  const introText = `${greetingText} Let's start with: Tell me about yourself.`;

  let audioBase64 = null;
  try { audioBase64 = await generateAudio(introText); } catch {}

  const interview = await Interview.create({
    userId, role, totalQuestions,
    questions,
    messages: [{ role: 'assistant', content: introText }],
    currentQuestion: 1,
    status: 'in-progress',
  });

  return { interview, audioBase64, introText };
};

export const submitAnswer = async (interviewId, userId, answerText) => {
  const interview = await Interview.findOne({ _id: interviewId, userId });
  if (!interview) { const e = new Error('Interview not found'); e.statusCode = 404; throw e; }

  interview.messages.push({ role: 'user', content: answerText });

  const isLastQuestion = interview.currentQuestion >= interview.totalQuestions;
  let responseText, audioBase64;

  if (isLastQuestion) {
    responseText = "Thank you for all your answers! That concludes our interview. I'll now prepare your detailed feedback.";
    interview.status = 'completed';
  } else {
    interview.currentQuestion += 1;
    const nextQ = interview.questions[interview.currentQuestion - 1];
    const history = buildConversationHistory(interview.messages);
    responseText = await askGemini(FOLLOW_UP_PROMPT(history, nextQ.text));
    interview.messages.push({ role: 'assistant', content: responseText });
  }

  try { audioBase64 = await generateAudio(responseText); } catch {}
  await interview.save();

  return {
    responseText, audioBase64,
    isComplete: isLastQuestion,
    currentQuestion: interview.currentQuestion,
    nextQuestion: !isLastQuestion ? interview.questions[interview.currentQuestion - 1] : null,
  };
};

export const submitCode = async (interviewId, userId, code, language, questionIndex) => {
  const interview = await Interview.findOne({ _id: interviewId, userId });
  if (!interview) { const e = new Error('Interview not found'); e.statusCode = 404; throw e; }

  const question = interview.questions[questionIndex - 1];
  const evalRaw = await askGemini(EVALUATE_CODE_PROMPT(question.text, code, language));
  const evaluation = parseGeminiJSON(evalRaw);

  interview.codeSubmissions.push({ questionIndex, code, language, evaluation });
  interview.messages.push({
    role: 'user',
    content: `[Code submission in ${language}]\n${code}`,
  });

  const isLastQuestion = interview.currentQuestion >= interview.totalQuestions;
  let responseText, audioBase64;

  if (isLastQuestion) {
    responseText = "Great effort on that code! That wraps up our interview. Generating your feedback now.";
    interview.status = 'completed';
  } else {
    interview.currentQuestion += 1;
    const nextQ = interview.questions[interview.currentQuestion - 1];
    responseText = `Your solution looks ${evaluation.isCorrect ? 'good' : 'interesting'}! ${evaluation.feedback.substring(0, 80)}... Moving on: ${nextQ.text}`;
    interview.messages.push({ role: 'assistant', content: responseText });
  }

  try { audioBase64 = await generateAudio(responseText); } catch {}
  await interview.save();

  return { responseText, audioBase64, evaluation, isComplete: isLastQuestion };
};

export const endInterview = async (interviewId, userId) => {
  const interview = await Interview.findOne({ _id: interviewId, userId });
  if (!interview) { const e = new Error('Interview not found'); e.statusCode = 404; throw e; }

  if (interview.status === 'completed' && interview.feedback) {
    return { interviewId: interview._id, feedback: interview.feedback, overallScore: interview.overallScore };
  }

  const history = buildConversationHistory(interview.messages);
  const feedbackRaw = await askGemini(FEEDBACK_PROMPT(interview.role, history, interview.codeSubmissions));
  const feedback = parseGeminiJSON(feedbackRaw);

  interview.feedback = feedback;
  interview.overallScore = feedback.overallScore;
  interview.status = 'completed';
  await interview.save();

  return { interviewId: interview._id, feedback, overallScore: feedback.overallScore };
};

export const getInterviewById = async (interviewId, userId) => {
  const interview = await Interview.findOne({ _id: interviewId, userId });
  if (!interview) { const e = new Error('Interview not found'); e.statusCode = 404; throw e; }
  return interview;
};