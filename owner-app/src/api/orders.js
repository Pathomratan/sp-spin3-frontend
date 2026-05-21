import { api } from '../utils/api'

export const getOrders = () => api.get('/orders')

export const updateOrderStatus = (id, status) => api.patch(`/orders/${id}`, { status })

export const createOrder = (order) => api.post('/orders', order)
