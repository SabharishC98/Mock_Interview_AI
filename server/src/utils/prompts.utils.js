export const parseGeminiJSON = (text) => {
  let cleanText = text.trim();

  // Try parsing directly first
  try {
    return JSON.parse(cleanText);
  } catch (e) {}

  // Try to clean markdown code blocks
  if (cleanText.startsWith('```')) {
    cleanText = cleanText.replace(/^```(?:json)?\n?/, '');
    cleanText = cleanText.replace(/\n?```\s*$/, '');
    try {
      return JSON.parse(cleanText.trim());
    } catch (e) {}
  }

  // Find outermost JSON structure (either { ... } or [ ... ])
  const firstBrace = cleanText.indexOf('{');
  const firstBracket = cleanText.indexOf('[');
  
  let startIdx = -1;
  let endIdx = -1;
  
  if (firstBrace !== -1 && (firstBracket === -1 || firstBrace < firstBracket)) {
    startIdx = firstBrace;
    endIdx = cleanText.lastIndexOf('}');
  } else if (firstBracket !== -1) {
    startIdx = firstBracket;
    endIdx = cleanText.lastIndexOf(']');
  }

  if (startIdx !== -1 && endIdx !== -1 && endIdx > startIdx) {
    let jsonCandidate = cleanText.substring(startIdx, endIdx + 1);
    try {
      return JSON.parse(jsonCandidate);
    } catch (e) {
      // Handle control characters in string literals (e.g. unescaped newlines/tabs)
      try {
        let sanitized = '';
        let inString = false;
        let escape = false;
        for (let i = 0; i < jsonCandidate.length; i++) {
          const char = jsonCandidate[i];
          if (char === '"' && !escape) {
            inString = !inString;
          }
          
          if (inString) {
            if (char === '\\' && !escape) {
              escape = true;
              sanitized += char;
            } else {
              if (escape) {
                escape = false;
                sanitized += char;
              } else if (char === '\n') {
                sanitized += '\\n';
              } else if (char === '\r') {
                sanitized += '\\r';
              } else if (char === '\t') {
                sanitized += '\\t';
              } else if (char.charCodeAt(0) < 32) {
                // Ignore other raw control characters
              } else {
                sanitized += char;
              }
            }
          } else {
            sanitized += char;
            escape = false;
          }
        }
        return JSON.parse(sanitized);
      } catch (innerError) {
        throw new Error(`JSON parsing failed: ${innerError.message}\nRaw LLM response: ${text}`);
      }
    }
  }

  throw new Error(`No JSON found in response:\n${text}`);
};