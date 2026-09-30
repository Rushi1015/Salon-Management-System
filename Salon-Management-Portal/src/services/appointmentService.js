import { api } from './api';

export const getMyAppointments = async (params = {}) => {
  const response = await api.get('/api/appointments/my', { params });
  return response.data;
};

export const getAllAppointments = async (params = {}) => {
  const response = await api.get('/api/appointments', { params });
  return response.data;
};

export const getBarberAppointments = async (params = {}) => {
  const response = await api.get('/api/appointments/barber', { params });
  return response.data;
};

export const getAvailableSlots = async (barberId, date) => {
  const response = await api.get('/api/appointments/available-slots', {
    params: { barberId, date },
  });
  return response.data;
};

export const createAppointment = async (data) => {
  const response = await api.post('/api/appointments', data);
  return response.data;
};

export const updateAppointmentStatus = async (id, status) => {
  const response = await api.put(`/api/appointments/${id}/status`, { status });
  return response.data;
};

export const cancelAppointment = async (id, reason = '') => {
  const response = await api.put(`/api/appointments/${id}/cancel`, { reason });
  return response.data;
};

export const rescheduleAppointment = async (id, data) => {
  const response = await api.put(`/api/appointments/${id}/reschedule`, data);
  return response.data;
};

export const assignBarber = async (id, barberId) => {
  const response = await api.put(`/api/appointments/${id}/assign`, { barberId });
  return response.data;
};
