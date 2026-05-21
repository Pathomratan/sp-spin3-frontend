import { api } from '../utils/api'

export const getDashboardSummary = (period) => api.get(`/dashboard/summary?period=${period}`)
