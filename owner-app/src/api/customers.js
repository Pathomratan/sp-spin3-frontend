import { api } from '../utils/api'

export const getCustomers = () => api.get('/customers')

export const updateCustomer = (id, updates) => api.patch(`/customers/${id}`, updates)
