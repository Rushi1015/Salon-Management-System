import { api } from './api';

export const getServices = async (params = {}) => {
  const response = await api.get('/api/services', { params });
  return response.data;
};

export const getServiceCategories = async () => {
  const response = await api.get('/api/services/categories');
  return response.data;
};

export const getServiceById = async (id) => {
  const response = await api.get(`/api/services/${id}`);
  return response.data;
};

export const createService = async (data) => {
  const response = await api.post('/api/services', data);
  return response.data;
};

export const updateService = async (id, data) => {
  const response = await api.put(`/api/services/${id}`, data);
  return response.data;
};

export const deleteService = async (id) => {
  const response = await api.delete(`/api/services/${id}`);
  return response.data;
};
