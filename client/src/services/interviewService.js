import API from './api.js';

export const uploadResume = async (file) => {
  const formData = new FormData();
  formData.append('resume', file);
  const res = await API.post('/resume/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data.data;
};

export const getResume = async () => {
  const res = await API.get('/resume');
  return res.data.data;
};

export const startInterview = async (role, resumeText, totalQuestions) => {
  const res = await API.post('/interview/start', { role, resumeText, totalQuestions });
  return res.data.data;
};

export const submitTextAnswer = async (id, answer) => {
  const res = await API.post(`/interview/${id}/answer`, { answer });
  return res.data.data;
};

export const transcribeAudio = async (audioBlob) => {
  const formData = new FormData();
  formData.append('audio', audioBlob, 'answer.webm');
  const res = await API.post('/interview/transcribe', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data.data.transcript;
};

export const submitCode = async (id, code, language, questionIndex) => {
  const res = await API.post(`/interview/${id}/code`, { code, language, questionIndex });
  return res.data.data;
};

export const endInterview = async (id) => {
  const res = await API.post(`/interview/${id}/end`);
  return res.data.data;
};

export const getInterview = async (id) => {
  const res = await API.get(`/interview/${id}`);
  return res.data.data;
};