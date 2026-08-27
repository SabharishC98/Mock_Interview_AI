import { createRequire } from 'module';
const require = createRequire(import.meta.url);
require('dotenv').config();

import Groq from 'groq-sdk';

const client = new Groq({ apiKey: process.env.GROQ_API_KEY });

export const generateContent = async (prompt) => {
  const completion = await client.chat.completions.create({
    model: 'openai/gpt-oss-120b',
    messages: [{ role: 'user', content: prompt }],
    max_tokens: 2048,
  });
  return completion.choices[0].message.content;
};
