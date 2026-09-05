import api from './api';

export const getDashboardReports = async () => {
  const response = await api.get('/reports');
  return response.data;
};
