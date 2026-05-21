import { api } from '../utils/api'

export const getPromotions = () => api.get('/promotions')

export const updatePromotion = (id, updates) => api.patch(`/promotions/${id}`, updates)

export const deletePromotion = (id) => api.delete(`/promotions/${id}`)
