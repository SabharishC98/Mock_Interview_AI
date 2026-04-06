// server/src/services/assemblyai.service.js
import { AssemblyAI } from 'assemblyai';
import fs from 'fs';
import path from 'path';
import os from 'os';

const client = new AssemblyAI({ apiKey: process.env.ASSEMBLYAI_API_KEY });

export const transcribeAudio = async (audioBuffer, originalName) => {
  const extension = path.extname(originalName) || '.webm';
  const tmpPath = path.join(os.tmpdir(), `audio_${Date.now()}${extension}`);
  try {
    fs.writeFileSync(tmpPath, audioBuffer);
    const transcript = await client.transcripts.transcribe({ audio: tmpPath });
    if (transcript.status === 'error') throw new Error(transcript.error);
    return transcript.text || '';
  } finally {
    if (fs.existsSync(tmpPath)) fs.unlinkSync(tmpPath);
  }
};