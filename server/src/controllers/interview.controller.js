// server/src/controllers/interview.controller.js
import * as interviewService from '../services/interview.service.js';
import { transcribeAudio } from '../services/assemblyai.service.js';
import { streamAudio } from '../services/murf.service.js';

export const startInterview = async (req, res, next) => {
  try {
    const { role, resumeText, totalQuestions } = req.body;
    if (!role) return res.status(400).json({ success: false, message: 'Role is required.' });
    if (!resumeText) return res.status(400).json({ success: false, message: 'Resume text is required.' });
    const result = await interviewService.startInterview(
      req.user._id, role, resumeText, totalQuestions || 5, req.user.name
    );
    res.status(201).json({ success: true, data: result });
  } catch (err) { next(err); }
};

export const submitTextAnswer = async (req, res, next) => {
  try {
    const result = await interviewService.submitAnswer(req.params.id, req.user._id, req.body.answer);
    res.json({ success: true, data: result });
  } catch (err) { next(err); }
};

export const submitVoiceAnswer = async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'No audio file.' });
    const transcript = await transcribeAudio(req.file.buffer, req.file.originalname);
    const result = await interviewService.submitAnswer(req.params.id, req.user._id, transcript);
    res.json({ success: true, data: { ...result, transcript } });
  } catch (err) { next(err); }
};

export const submitCode = async (req, res, next) => {
  try {
    const { code, language, questionIndex } = req.body;
    const result = await interviewService.submitCode(req.params.id, req.user._id, code, language, questionIndex);
    res.json({ success: true, data: result });
  } catch (err) { next(err); }
};

export const endInterview = async (req, res, next) => {
  try {
    const result = await interviewService.endInterview(req.params.id, req.user._id);
    res.json({ success: true, data: result });
  } catch (err) { next(err); }
};

export const getInterview = async (req, res, next) => {
  try {
    const interview = await interviewService.getInterviewById(req.params.id, req.user._id);
    res.json({ success: true, data: interview });
  } catch (err) { next(err); }
};

export const transcribeOnly = async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'No audio file.' });
    const transcript = await transcribeAudio(req.file.buffer, req.file.originalname);
    res.json({ success: true, data: { transcript } });
  } catch (err) { next(err); }
};

export const speakText = async (req, res, next) => {
  try {
    await streamAudio(req.body.text, res);
  } catch (err) { next(err); }
};