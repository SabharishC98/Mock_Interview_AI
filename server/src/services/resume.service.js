// server/src/services/resume.service.js
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs';
import Resume from '../models/Resume.model.js';

export const parseResumePDF = async (pdfBuffer) => {
  const uint8Array = new Uint8Array(pdfBuffer.buffer, pdfBuffer.byteOffset, pdfBuffer.byteLength);
  const pdf = await pdfjsLib.getDocument({ data: uint8Array }).promise;
  let text = '';
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    text += content.items.map(item => item.str).join(' ') + '\n';
  }
  if (!text.trim()) throw new Error('Could not extract text from PDF.');
  return text;
};

export const saveResume = async (userId, fileName, extractedText) => {
  return Resume.findOneAndUpdate(
    { userId },
    { userId, fileName, extractedText },
    { upsert: true, new: true }
  );
};

export const getResumeByUserId = async (userId) => {
  return Resume.findOne({ userId });
};