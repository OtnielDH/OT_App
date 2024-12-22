import axios from 'axios'

const apiClient = axios.create({
    baseURL: 'http://localhost:8000',
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
        return apiClient.get('/api/overtime-requests/')
    },

    getSingleOvertimeRequest(id) {
        return apiClient.get(`/api/overtime-requests/${id}/`)
    },

    createOvertimeRequest(overtimeData) {
        return apiClient.post('/api/overtime-requests/', overtimeData)
    },

    updateOvertimeRequest(id, overtimeData) {
        return apiClient.put(`/api/overtime-requests/${id}/`, overtimeData)
    },

    deleteOvertimeRequest(id) {
        return apiClient.delete(`/api/overtime-requests/${id}/`)
    },

    async checkExistingOvertimeRequest(employeeId, date) {
        return apiClient.get(`/api/overtime-requests/?employee=${employeeId}&request_date=${date}`)
    }

}