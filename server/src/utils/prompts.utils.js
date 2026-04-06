export const parseGeminiJSON = (text) => {
  let cleanText = text.trim();
  if (cleanText.startsWith('```')) {
    cleanText = cleanText.replace(/^```(?:json)?\n?/, '');
    cleanText = cleanText.replace(/\n?```\s*$/, '');
  }
  return JSON.parse(cleanText.trim());
};