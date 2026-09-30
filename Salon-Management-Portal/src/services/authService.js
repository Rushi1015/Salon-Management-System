import { api } from './api';

export const loginService = async (data) => {
  const response = await api.post('/api/auth/login', data);
  return response.data;
};

export const registerService = async (data) => {
  const response = await api.post('/api/auth/register', data);
  return response.data;
};

export const getMeService = async () => {
  const response = await api.get('/api/auth/me');
  return response.data;
};

export const updateProfileService = async (data) => {
  const response = await api.put('/api/auth/profile', data);
  return response.data;
};

export const changePasswordService = async (data) => {
  const response = await api.put('/api/auth/change-password', data);
  return response.data;
};

export const forgotPasswordService = async (data) => {
  const response = await api.post('/api/auth/forgot-password', data);
  return response.data;
};

export const resetPasswordService = async (data) => {
  const response = await api.post('/api/auth/reset-password', data);
  return response.data;
};
