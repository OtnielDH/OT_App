import api from '@/services/api'

export function useOvertimeApi(state, computed) {
    const loadInitialData = async () => {
        try {
            state.loading.value = true
            const [projectsResponse, employeesResponse] = await Promise.all([
                api.getProjects(),
                api.getEmployees()
            ])

            state.projects.value = projectsResponse.data
            state.employees.value = employeesResponse.data
            state.selectedDate.value = state.today
        } catch (error) {
            state.error.value = 'Failed to load projects'
            console.error('Error:', error)
        } finally {
            state.loading.value = false
        }
    }

    const resetForm = (clearEmployee = true) => {
        if (clearEmployee) {
            state.selectedEmployees.value = ''
        }
        state.selectedProjects.value = ''
        state.timeStart.value = '17:20'
        state.timeEnd.value = '18:20'
        state.hasBreak.value = false
        state.timeBreakStart.value = ''
        state.timeBreakEnd.value = ''
        state.overtimeReason.value = ''
    }

    const submitOvertimeRequest = async (validateForm, totalHours, totalBreakHours, retries = 3) => {
        try {
            state.submitting.value = true

            const validationError = validateForm()
            if (validationError) {
                console.error(validationError)
                return
            }

            const formatTime = (time) => {
                if (!time || time.trim() === '') return null
                // Add validation logging
                console.log('Formatting time:', time)
                // Ensure correct time format HH:MM
                const [hours, minutes] = time.split(':')
                return `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}`
            }

            // Debug logging
            console.log('Has break:', state.hasBreak.value)
            console.log('Break start:', state.timeBreakStart.value)
            console.log('Break end:', state.timeBreakEnd.value)

            const overtimeData = {
                employee: Number(state.selectedEmployees.value),
                employee_name: state.employees.value.find(emp => emp.id === Number(state.selectedEmployees.value))?.name || '',
                project: Number(state.selectedProjects.value),
                project_name: state.projects.value.find(proj => proj.id === Number(state.selectedProjects.value))?.name || '',
                request_date: state.selectedDate.value,
                time_start: formatTime(state.timeStart.value),
                time_end: formatTime(state.timeEnd.value),
                has_break: Boolean(state.hasBreak.value),
                break_start: state.hasBreak.value ? formatTime(state.timeBreakStart.value) : null,
                break_end: state.hasBreak.value ? formatTime(state.timeBreakEnd.value) : null,
                reason: state.overtimeReason.value,
                total_hours: totalHours || 0,
                break_hours: state.hasBreak.value ? (totalBreakHours || 0) : 0,
            }

            try {
                const existingRequest = await api.checkExistingOvertimeRequest(
                    state.selectedEmployees.value,
                    state.selectedDate.value
                )

                if (existingRequest.data.length > 0) {
                    const existingId = existingRequest.data[0].id
                    await api.updateOvertimeRequest(existingId, overtimeData)
                    console.log('Overtime request updated successfully')
                } else {
                    await api.createOvertimeRequest(overtimeData)
                    console.log('Overtime request submitted successfully')
                }

                await checkExistingRequest(state.selectedEmployees.value, state.selectedDate.value)

                // Export JSON after successful submission
                try {
                    console.log('Exporting JSON for date:', state.selectedDate.value)
                    const exportResponse = await api.exportOvertimeJson(state.selectedDate.value)
                    console.log('Export response:', exportResponse.data)
                } catch (exportError) {
                    console.error('Failed to export JSON:', exportError)
                }

            } catch (error) {
                if (error.response?.status === 409 && retries > 0) {
                    console.log(`Request in queue, retrying... (${retries} attempts left)`)
                    await new Promise(resolve => setTimeout(resolve, 1000))
                    return submitOvertimeRequest(validateForm, totalHours, totalBreakHours, retries - 1)
                }
                throw error
            }
        } catch (error) {
            console.error('Submission error:', error)
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
            state.submitting.value = false
        }
    }

    const checkExistingRequest = async (employeeId, date) => {
        if (!employeeId || !date) {
            state.hasExistingRequest.value = false
            return
        }

        try {
            const existingRequest = await api.checkExistingOvertimeRequest(
                employeeId,
                date
            )

            state.hasExistingRequest.value = existingRequest.data.length > 0

            if (existingRequest.data.length > 0) {
                const request = existingRequest.data[0]
                state.selectedProjects.value = request.project
                state.timeStart.value = request.time_start.slice(0, 5)
                state.timeEnd.value = request.time_end.slice(0, 5)
                state.hasBreak.value = Boolean(request.has_break)
                if (request.has_break && request.break_start && request.break_end) {
                    state.timeBreakStart.value = request.break_start.slice(0, 5)
                    state.timeBreakEnd.value = request.break_end.slice(0, 5)
                }
                state.overtimeReason.value = request.reason
                console.log('Existing overtime request loaded')
            } else {
                resetForm(false)
            }
        } catch (error) {
            console.error('Error checking request:', error)
        }
    }

    const deleteOvertimeRequest = async (retries = 3) => {
        if (!confirm('Are you sure you want to delete this request?')) return

        try {
            state.deleting.value = true
            const existingRequest = await api.checkExistingOvertimeRequest(
                state.selectedEmployees.value,
                state.selectedDate.value
            )

            if (existingRequest.data.length > 0) {
                try {
                    const existingId = existingRequest.data[0].id
                    await api.deleteOvertimeRequest(existingId)
                    console.log('Overtime request deleted successfully')

                    // Export JSON after successful deletion
                    try {
                        console.log('Exporting JSON for date:', state.selectedDate.value)
                        const exportResponse = await api.exportOvertimeJson(state.selectedDate.value)
                        console.log('Export response:', exportResponse.data)
                    } catch (exportError) {
                        console.error('Failed to export JSON:', exportError)
                    }

                    resetForm(false)  // Keep employee selected
                    state.hasExistingRequest.value = false
                } catch (error) {
                    if (error.response?.status === 409 && retries > 0) {
                        console.log(`Delete in queue, retrying... (${retries} attempts left)`)
                        await new Promise(resolve => setTimeout(resolve, 1000))
                        return deleteOvertimeRequest(retries - 1)
                    }
                    throw error
                }
            } else {
                console.error('No existing request found to delete')
            }
        } catch (error) {
            console.error('Failed to delete request:', error)
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
            state.deleting.value = false
        }
    }

    return {
        loadInitialData,
        submitOvertimeRequest,
        checkExistingRequest,
        deleteOvertimeRequest,
        resetForm
    }
}