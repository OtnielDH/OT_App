import axios from 'axios'

const apiClient = axios.create({
        baseURL: 'http://localhost:8001',
        headers: {
            'Content-Type': 'application/json'
        }
    })

export default {
    getProjects() {
        return apiClient.get('api/projects')
    },
    
    getEmployees() {
        return apiClient.get('api/employees')
    },

    // Overtime request
    getAllOvertimeRequests() {
        return apiClient.get('/api/overtime/')
    },

    getSingleOvertimeRequest(id) {
        return apiClient.get(`/api/overtime/${id}/`)
    },
    
    createOvertimeRequest(overtimeData) {
        return apiClient.post('/api/overtime/', overtimeData)
    },

    updateOvertimeRequest(id, overtimeData) {
        return apiClient.put(`/api/overtime/${id}/`, overtimeData)
    },

    deleteOvertimeRequest(id) {
        return apiClient.delete(`/api/overtime/${id}/`)
    },
}