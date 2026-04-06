export const GENERATE_QUESTIONS_PROMPT = (role, resumeText, totalQuestions) => `
You are an expert technical interviewer. Generate ${totalQuestions} interview questions
for a ${role} candidate based on this resume:

${resumeText}

Rules:
- Mix behavioral, technical, and coding questions
- For coding questions set "isCodeQuestion": true and include "codeSnippet" with starter code
- Questions should be specific to their experience, not generic

RESPONSE FORMAT — return ONLY a valid JSON array, no markdown:
[
  { "text": "question text", "type": "behavioral|technical|coding", "isCodeQuestion": false },
  { "text": "Write a function to...", "type": "coding", "isCodeQuestion": true, "codeSnippet": "function solve() {\n  // your code\n}" }
]`;

export const INTERVIEW_GREETING_PROMPT = (name, role) => `
Generate a warm, professional greeting for a mock interview.
The AI interviewer is named Natalie. The candidate's name is ${name} and they're interviewing for ${role}.
Keep it to 2-3 sentences. Return only the greeting text, no JSON.`;

export const FOLLOW_UP_PROMPT = (conversationHistory, nextQuestion) => `
You are Natalie, a professional AI interviewer. Here is the conversation so far:

${conversationHistory}

Acknowledge the candidate's last answer briefly (1 sentence), then transition to the next question:
"${nextQuestion}"

Return only the spoken response text, no JSON, no markdown.`;

export const FEEDBACK_PROMPT = (role, conversationHistory, codeSubmissions) => `
You are an expert interviewer evaluating a ${role} candidate.

Conversation:
${conversationHistory}

Code submissions:
${JSON.stringify(codeSubmissions)}

Provide detailed feedback as JSON:
{
  "overallScore": 75,
  "categories": {
    "technicalKnowledge": { "score": 80, "comment": "..." },
    "problemSolving": { "score": 70, "comment": "..." },
    "communication": { "score": 75, "comment": "..." },
    "codeQuality": { "score": 65, "comment": "..." },
    "behavioralFit": { "score": 80, "comment": "..." }
  },
  "strengths": ["strength1", "strength2"],
  "areasForImprovement": ["area1", "area2"],
  "finalAssessment": "Overall summary paragraph"
}`;

export const EVALUATE_CODE_PROMPT = (question, code, language) => `
Evaluate this ${language} code submission for the question: "${question}"

Code:
${code}

Return JSON:
{
  "score": 75,
  "isCorrect": true,
  "feedback": "Detailed feedback on the solution",
  "timeComplexity": "O(n)",
  "spaceComplexity": "O(1)",
  "improvements": ["suggestion1", "suggestion2"]
}`;

export const buildConversationHistory = (messages) =>
  messages.slice(-20).map(m =>
    `${m.role === 'assistant' ? 'Natalie' : 'Candidate'}: ${m.content}`
  ).join('\n');