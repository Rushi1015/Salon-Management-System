import { api } from './api';

export const getOverviewStats = async () => {
  const response = await api.get('/api/analytics/overview');
  return response.data;
};

export const getRevenueAnalytics = async (params = {}) => {
  const response = await api.get('/api/analytics/revenue', { params });
  return response.data;
};

export const getUserGrowth = async () => {
  const response = await api.get('/api/analytics/user-growth');
  return response.data;
};

export const getServicePopularity = async () => {
  const response = await api.get('/api/analytics/service-popularity');
  return response.data;
};

export const getStaffPerformance = async () => {
  const response = await api.get('/api/analytics/staff-performance');
  return response.data;
};

export const getMonthlyAppointments = async () => {
  const response = await api.get('/api/analytics/monthly-appointments');
  return response.data;
};

export const getCustomerDashboard = async () => {
  const response = await api.get('/api/dashboard/customer');
  return response.data;
};

export const getBarberDashboard = async () => {
  const response = await api.get('/api/dashboard/barber');
  return response.data;
};

export const getReceptionistDashboard = async () => {
  const response = await api.get('/api/dashboard/receptionist');
  return response.data;
};
