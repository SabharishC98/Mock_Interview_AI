// server/src/services/murf.service.js
import axios from 'axios';

const MURF_BASE_URL = 'https://global.api.murf.ai/v1/speech/stream';
const MURF_VOICE_ID = 'en-US-natalie';

const buildPayload = (text) => ({
  text: `[pause 1s] ${text}`,
  voiceId: MURF_VOICE_ID,
  model: 'FALCON',
  multiNativeLocale: 'en-US',
});

export const streamAudio = async (text, res) => {
  try {
    const response = await axios.post(MURF_BASE_URL, buildPayload(text), {
      headers: { 'api-key': process.env.MURF_API_KEY, 'Content-Type': 'application/json' },
      responseType: 'stream',
    });
    res.setHeader('Content-Type', 'audio/mpeg');
    response.data.pipe(res);
  } catch (err) {
    if (!res.headersSent) {
      res.status(500).json({ success: false, message: 'Audio generation failed' });
    }
  }
};

export const generateAudio = async (text) => {
  const response = await axios.post(MURF_BASE_URL, buildPayload(text), {
    headers: { 'api-key': process.env.MURF_API_KEY, 'Content-Type': 'application/json' },
    responseType: 'arraybuffer',
  });
  return Buffer.from(response.data).toString('base64');
};