import { api } from './api';

export const getAllStaff = async (params = {}) => {
  const response = await api.get('/api/staff', { params });
  return response.data;
};

export const getStaffById = async (id) => {
  const response = await api.get(`/api/staff/${id}`);
  return response.data;
};

export const createStaff = async (data) => {
  const response = await api.post('/api/staff', data);
  return response.data;
};

export const updateStaff = async (id, data) => {
  const response = await api.put(`/api/staff/${id}`, data);
  return response.data;
};

export const deleteStaff = async (id) => {
  const response = await api.delete(`/api/staff/${id}`);
  return response.data;
};

export const updateShift = async (id, data) => {
  const response = await api.put(`/api/staff/${id}/shift`, data);
  return response.data;
};

export const getStaffAvailability = async (params = {}) => {
  const response = await api.get('/api/staff/availability', { params });
  return response.data;
};

export const getAllTimeOffs = async () => {
  const response = await api.get('/api/staff/time-off');
  return response.data;
};

export const getMyTimeOffs = async () => {
  const response = await api.get('/api/staff/my-time-off');
  return response.data;
};

export const requestTimeOff = async (data) => {
  const response = await api.post('/api/staff/time-off', data);
  return response.data;
};

export const updateTimeOffStatus = async (id, status) => {
  const response = await api.put(`/api/staff/time-off/${id}`, { status });
  return response.data;
};
