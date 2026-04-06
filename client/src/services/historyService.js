import API from './api.js';

export const getHistory = async (page = 1, limit = 10) => {
  const res = await API.get(`/history?page=${page}&limit=${limit}`);
  return res.data.data;
};
export const deleteHistoryItem = async (id) => (await API.delete(`/history/${id}`)).data;
export const clearHistory = async () => (await API.delete('/history/clear')).data;