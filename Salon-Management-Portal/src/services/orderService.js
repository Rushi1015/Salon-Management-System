import { api } from './api';

export const createOrder = async (data) => {
  const response = await api.post('/api/orders', data);
  return response.data;
};

export const getMyOrders = async (params = {}) => {
  const response = await api.get('/api/orders/my', { params });
  return response.data;
};

export const getAllOrders = async (params = {}) => {
  const response = await api.get('/api/orders', { params });
  return response.data;
};

export const updateOrderStatus = async (id, status) => {
  const response = await api.put(`/api/orders/${id}/status`, { status });
  return response.data;
};

export const cancelOrder = async (id) => {
  const response = await api.put(`/api/orders/${id}/cancel`);
  return response.data;
};
