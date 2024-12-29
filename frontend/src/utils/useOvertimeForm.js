import { ref, computed, watch } from 'vue'
import api from '@/services/api'
import { calculateTimeDifference } from '@/utils/timeCalculations'

export function useOvertimeForm() {
    const projects = ref([])
    const selectedProjects = ref('')
    const employees = ref([])
    const selectedEmployees = ref('')
    const loading = ref(true)
    const error = ref(null)
    const timeStart = ref('17:20')
    const timeEnd = ref('18:20')
    const hasBreak = ref(false)
    const timeBreakStart = ref('')
    const timeBreakEnd = ref('')
    const overtimeReason = ref('')
    const submitting = ref(false)
    const deleting = ref(false)
    const hasExistingRequest = ref(false)

    const today = new Date().toISOString().split('T')[0]
    const selectedDate = ref(today)

    const validateForm = () => {
        if (!selectedEmployees.value) return 'Please select an employee'
        if (!selectedProjects.value) return 'Please select a project'
        if (!selectedDate.value) return 'Please select a date'
        if (!timeStart.value || !timeEnd.value) return 'Please set overtime hours'
        if (hasBreak.value && (!timeBreakStart.value || !timeBreakEnd.value)) {
            return 'Please set break hours'
        }
        if (!overtimeReason.value) return 'Please provide overtime reason'
        return null
    }

    const submitOvertimeRequest = async () => {
        try {
            submitting.value = true
            const validationError = validateForm()
            if (validationError) {
                console.error(validationError)
                return
            }

            const formatTime = (time) => time ? `${time}:00` : null
            const overtimeData = {
                employee: Number(selectedEmployees.value),
                project: Number(selectedProjects.value),
                request_date: selectedDate.value,
                time_start: formatTime(timeStart.value),
                time_end: formatTime(timeEnd.value),
                has_break: Boolean(hasBreak.value),
                break_start: hasBreak.value ? formatTime(timeBreakStart.value) : null,
                break_end: hasBreak.value ? formatTime(timeBreakEnd.value) : null,
                reason: overtimeReason.value,
                total_hours: parseFloat(totalHours.value) || 0,
                break_hours: hasBreak.value ? parseFloat(totalBreakHours.value) || 0 : 0
            }

            // Check existing request
            const existingRequest = await api.checkExistingOvertimeRequest(
                selectedEmployees.value,
                selectedDate.value
            )

            let response
            if (existingRequest.data.length > 0) {
                const existingId = existingRequest.data[0].id
                response = await api.updateOvertimeRequest(existingId, overtimeData)
                console.log('Overtime request updated successfully')
            } else {
                response = await api.createOvertimeRequest(overtimeData)
                console.log('Overtime request submitted successfully')
            }

            hasExistingRequest.value = true
            await checkExistingRequest(selectedEmployees.value, selectedDate.value)

        } catch (error) {
            const errorMessage = error.response?.data || error.message
            if (typeof errorMessage === 'object') {
                const messages = Object.entries(errorMessage)
                    .map(([field, errors]) => `${field}: ${errors.join(', ')}`)
                    .join('\n')
                console.error(messages)
            } else {
                console.error(errorMessage)
            }
        } finally {
            submitting.value = false
        }
    }

    const deleteOvertimeRequest = async () => {
        if (!confirm('Are you sure you want to delete this request?')) return

        try {
            deleting.value = true
            const existingRequest = await api.checkExistingOvertimeRequest(
                selectedEmployees.value,
                selectedDate.value
            )

            if (existingRequest.data.length > 0) {
                const existingId = existingRequest.data[0].id
                await api.deleteOvertimeRequest(existingId)
                console.log('Overtime request deleted successfully')
                resetForm()
            } else {
                console.error('No existing request found to delete')
            }
        } catch (error) {
            console.error('Failed to delete request')
        } finally {
            deleting.value = false
        }
    }

    const checkExistingRequest = async (employeeId, date) => {
        if (!employeeId || !date) {
            hasExistingRequest.value = false
            return
        }

        try {
            const existingRequest = await api.checkExistingOvertimeRequest(
                employeeId,
                date
            )

            hasExistingRequest.value = existingRequest.data.length > 0

            if (existingRequest.data.length > 0) {
                // Populate form with existing request data
                const request = existingRequest.data[0]
                selectedProjects.value = request.project
                timeStart.value = request.time_start.slice(0, 5)
                timeEnd.value = request.time_end.slice(0, 5)
                hasBreak.value = request.has_break
                if (request.has_break) {
                    timeBreakStart.value = request.break_start?.slice(0, 5) || ''
                    timeBreakEnd.value = request.break_end?.slice(0, 5) || ''
                } else {
                    timeBreakStart.value = ''
                    timeBreakEnd.value = ''
                }
                overtimeReason.value = request.reason
                console.log('Existing overtime request loaded')
            } else {
                // Reset form fields but keep employee selection
                resetForm(false)
            }
        } catch (error) {
            console.error('Error checking request:', error)
            console.error('Failed to check existing request')
        }
    }

    watch([selectedEmployees, selectedDate], async ([newEmployee, newDate]) => {
        if (newEmployee && newDate) {
            await checkExistingRequest(newEmployee, newDate)
        }
    })

    const resetForm = (clearEmployee = true) => {
        if (clearEmployee) {
            selectedEmployees.value = ''
        }
        selectedProjects.value = ''
        timeStart.value = '17:20'  // Default start time
        timeEnd.value = '18:20'    // Default end time
        hasBreak.value = false
        timeBreakStart.value = ''
        timeBreakEnd.value = ''
        overtimeReason.value = ''
    }

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
            loading.value = true
            const [projectsResponse, employeesResponse] = await Promise.all([
                api.getProjects(),
                api.getEmployees()
            ])

            projects.value = projectsResponse.data
            employees.value = employeesResponse.data
            selectedDate.value = today
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
        loadInitialData,
        //request
        submitting,
        submitOvertimeRequest,
        //checking request
        checkExistingRequest,
        hasExistingRequest,
        //delete request
        deleting,
        deleteOvertimeRequest,
    }
}
