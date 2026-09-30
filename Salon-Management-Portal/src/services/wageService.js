import { api } from './api';

export const getWageRecords = async (params = {}) => {
  const response = await api.get('/api/wages', { params });
  return response.data;
};

export const getMyEarnings = async () => {
  const response = await api.get('/api/wages/my-earnings');
  return response.data;
};

export const getMonthlySummary = async (params = {}) => {
  const response = await api.get('/api/wages/monthly-summary', { params });
  return response.data;
};

export const createWageRecord = async (data) => {
  const response = await api.post('/api/wages', data);
  return response.data;
};

export const updateWageStatus = async (id, status) => {
  const response = await api.put(`/api/wages/${id}/status`, { status });
  return response.data;
};

export const updateCommissionRate = async (barberId, commissionRate) => {
  const response = await api.put(`/api/wages/commission/${barberId}`, { commissionRate });
  return response.data;
};
