import { api } from '../utils/api'

export const getMenu = () => api.get('/menu')

export const patchMenuItemAvailability = (id, available) => api.patch(`/menu/${id}`, { available })
