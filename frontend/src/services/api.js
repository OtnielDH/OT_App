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
    }
}