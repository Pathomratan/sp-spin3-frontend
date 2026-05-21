import { api } from '../utils/api'

export const getWaste = () => api.get('/waste')

export const createWasteEntries = (entries) => api.post('/waste', entries)
