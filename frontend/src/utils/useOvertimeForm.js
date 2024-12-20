import { ref, computed } from 'vue'
import api from '@/services/api'
import { calculateTimeDifference } from '@/utils/timeCalculations'

export function useOvertimeForm() {
    const projects = ref([])
    const selectedProjects = ref('')
    const employees = ref([])
    const selectedEmployees = ref('')
    const loading = ref(true)
    const error = ref(null)
    const selectedDate = ref('')
    const timeStart = ref('17:20')
    const timeEnd = ref('18:20')
    const hasBreak = ref(false)
    const timeBreakStart = ref('')
    const timeBreakEnd = ref('')
    const overtimeReason = ref('')

    const activeEmployees = computed(() => 
        employees.value.filter(employee => employee.is_enabled)
    )
    
    const selectedEmployeeId = computed(() => {
        const selectedEmployee = employees.value.find(
            employee => employee.id == selectedEmployees.value
        )
        return selectedEmployee ? selectedEmployee.emp_id : 'MW-------'
    })

    const totalHours = computed(() => 
        calculateTimeDifference(timeStart.value, timeEnd.value)
    )
    
    const totalBreakHours = computed(() => 
        calculateTimeDifference(timeBreakStart.value, timeBreakEnd.value)
    )

    const loadInitialData = async () => {
        try {
            const [projectsResponse, employeesResponse] = await Promise.all([
                api.getProjects(),
                api.getEmployees()
            ])

            projects.value = projectsResponse.data
            employees.value = employeesResponse.data
        } catch (error) {
            error.value = 'Failed to load projects'
            console.error('Error:', error)
        } finally {
            loading.value = false
        }
    }

    return {
        // state
        projects,
        selectedProjects,
        employees,
        selectedEmployees,
        loading,
        error,
        selectedDate,
        timeStart,
        timeEnd,
        hasBreak,
        timeBreakStart,
        timeBreakEnd,
        overtimeReason,
        // computed
        activeEmployees,
        selectedEmployeeId,
        totalHours,
        totalBreakHours,
        // methods
        loadInitialData
    }
}