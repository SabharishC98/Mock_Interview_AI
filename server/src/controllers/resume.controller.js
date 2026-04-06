// server/src/controllers/resume.controller.js
import * as resumeService from '../services/resume.service.js';

export const uploadResume = async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded.' });
    const extractedText = await resumeService.parseResumePDF(req.file.buffer);
    const resume = await resumeService.saveResume(req.user._id, req.file.originalname, extractedText);
    res.json({ success: true, data: { id: resume._id, fileName: resume.fileName,
      text: resume.extractedText, preview: resume.extractedText.substring(0, 500) } });
  } catch (err) { next(err); }
};

export const getResume = async (req, res, next) => {
  try {
    const resume = await resumeService.getResumeByUserId(req.user._id);
    if (!resume) return res.status(404).json({ success: false, message: 'No resume found' });
    res.json({ success: true, data: { id: resume._id, fileName: resume.fileName,
      text: resume.extractedText } });
  } catch (err) { next(err); }
};