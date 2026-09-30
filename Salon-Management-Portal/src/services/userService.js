import { api } from './api';

export const getBarbers = async () => {
  const response = await api.get('/api/users/barbers');
  return response.data;
};

export const getAllUsers = async (params = {}) => {
  const response = await api.get('/api/users', { params });
  return response.data;
};

export const updateUser = async (id, data) => {
  const response = await api.put(`/api/users/${id}`, data);
  return response.data;
};

export const deleteUser = async (id) => {
  const response = await api.delete(`/api/users/${id}`);
  return response.data;
};
