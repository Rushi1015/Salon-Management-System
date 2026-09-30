import { api } from './api';

export const getProducts = async (params = {}) => {
  const response = await api.get('/api/products', { params });
  return response.data;
};

export const getProductCategories = async () => {
  const response = await api.get('/api/products/categories');
  return response.data;
};

export const searchProducts = async (q) => {
  const response = await api.get('/api/products/search', { params: { q } });
  return response.data;
};

export const createProduct = async (data) => {
  const response = await api.post('/api/products', data);
  return response.data;
};

export const updateProduct = async (id, data) => {
  const response = await api.put(`/api/products/${id}`, data);
  return response.data;
};

export const deleteProduct = async (id) => {
  const response = await api.delete(`/api/products/${id}`);
  return response.data;
};
