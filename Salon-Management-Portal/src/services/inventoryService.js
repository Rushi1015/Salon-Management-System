import { api } from './api';

export const getInventory = async (params = {}) => {
  const response = await api.get('/api/inventory', { params });
  return response.data;
};

export const getLowStock = async () => {
  const response = await api.get('/api/inventory/low-stock');
  return response.data;
};

export const getInventoryCategories = async () => {
  const response = await api.get('/api/inventory/categories');
  return response.data;
};

export const createInventoryItem = async (data) => {
  const response = await api.post('/api/inventory', data);
  return response.data;
};

export const updateInventoryItem = async (id, data) => {
  const response = await api.put(`/api/inventory/${id}`, data);
  return response.data;
};

export const restockItem = async (id, quantity) => {
  const response = await api.put(`/api/inventory/${id}/restock`, { quantity });
  return response.data;
};

export const deleteInventoryItem = async (id) => {
  const response = await api.delete(`/api/inventory/${id}`);
  return response.data;
};
