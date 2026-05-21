import { api } from '../utils/api'

export const getStaff = () => api.get('/staff')

export const updateStaffStatus = (id, isLocked) => api.patch(`/staff/${id}`, { isLocked })

export const inviteStaff = (email, role) => api.post('/staff/invite', { email, role })
