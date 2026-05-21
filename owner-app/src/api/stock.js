import { api } from '../utils/api'

export const getStock = () => api.get('/stock')

export const updateStockLot = (id, updates) => api.patch(`/stock/${id}`, updates)
