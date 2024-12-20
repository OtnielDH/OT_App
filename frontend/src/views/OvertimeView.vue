<template>
    <div class="overtime-container">
        <h1 class="page-title">Overtime Request</h1>
        <CContainer class="form-container">
            <CRow class="justify-content-center mb-3">
                <CCol xs="12" md="8">
                    <CRow class="align-items-center mb-2">
                        <CCol xs="3" class="text-end">
                            <label class="credentials">NAME</label>
                        </CCol>
                        <CCol xs="9">
                            <CFormSelect class="text-center" v-model="selectedEmployees">
                                <option value="">Select Employees</option>
                                <option v-for="employee in activeEmployees" :key="employee.id" :value="employee.id">
                                    {{ employee.name }}
                                </option>
                            </CFormSelect>
                        </CCol>
                    </CRow>
                </CCol>
            </CRow>

            <CRow class="justify-content-center mb-3">
                <CCol xs="12" md="8">
                    <CRow class="align-items-center mb-2">
                        <CCol xs="3" class="text-end">
                            <label class="credentials">ID</label>
                        </CCol>
                        <CCol xs="9">
                            <label class="credentials text-center d-block">{{ selectedEmployeeId }}</label>
                        </CCol>
                    </CRow>
                </CCol>
            </CRow>

            <CRow class="justify-content-center mb-3">
                <CCol xs="12" md="8">
                    <CRow class="align-items-center mb-2">
                        <CCol xs="3" class="text-end">
                            <label class="credentials">PROJECT</label>
                        </CCol>
                        <CCol xs="9">
                            <CFormSelect class="text-center" v-model="selectedProjects">
                                <option value="">Select Project</option>
                                <option v-for="project in projects" :key="project.id" :value="project.id">
                                    {{ project.name }}
                                </option>
                            </CFormSelect>
                        </CCol>
                    </CRow>
                </CCol>
            </CRow>

            <CRow class="justify-content-center mb-4">
                <CCol xs="12" md="8">
                    <div class="form-section">
                        <label class="form-label">Select Date</label>
                        <CFormInput type="date" class="custom-input date-input" v-model="selectedDate"/>
                    </div>
                </CCol>
            </CRow>

            <CRow class="justify-content-center mb-4">
                <CCol xs="12" md="10">
                    <div class="time-section">
                        <CRow>
                            <CCol xs="4">
                                <div class="time-block">
                                    <label class="form-label">Start of OT Hour</label>
                                    <div class="time-picker">
                                        <VueDatePicker v-model="timeStart" time-picker model-type="HH:mm"
                                            :enable-seconds="false" :is-24="true" placeholder="Select Time">
                                            <template #input-icon>
                                                <div class="icon-wrapper">
                                                    <img class="datepicker-icon" src="@/assets/clock.png" />
                                                </div>
                                            </template>
                                        </VueDatePicker>
                                    </div>
                                </div>
                            </CCol>
                            <CCol xs="4">
                                <div class="hours-display">
                                    <label class="OT_hours">{{ totalHours }} Hours</label>
                                </div>
                            </CCol>
                            <CCol xs="4">
                                <div class="time-block">
                                    <label class="form-label">End of OT Hour</label>
                                    <div class="time-picker">
                                        <VueDatePicker v-model="timeEnd" time-picker model-type="HH:mm"
                                            :enable-seconds="false" :is-24="true" placeholder="Select Time">
                                            <template #input-icon>
                                                <div class="icon-wrapper">
                                                    <img class="datepicker-icon" src="@/assets/clock.png" />
                                                </div>
                                            </template>
                                        </VueDatePicker>
                                    </div>
                                </div>
                            </CCol>
                        </CRow>
                    </div>
                </CCol>
            </CRow>

            <CRow class="justify-content-center mb-4">
                <CCol xs="12" md="10">
                    <div class="break-section">
                        <div class="checkbox-wrapper">
                            <CFormCheck v-model="hasBreak" hitArea="full" label="Have Break"
                                class="custom-checkbox mb-2" />
                        </div>
                        <CRow>
                            <CCol xs="4">
                                <div class="time-picker-container">
                                    <label class="form-label">Break Duration</label>
                                    <div class="d-flex justify-content-center time-picker">
                                        <VueDatePicker v-model="timeBreakStart" time-picker model-type="HH:mm"
                                            :enable-seconds="false" :is-24="true" placeholder="Select Time">
                                            <template #input-icon>
                                                <div class="icon-wrapper">
                                                    <img class="datepicker-icon" src="@/assets/clock.png" />
                                                </div>
                                            </template>
                                        </VueDatePicker>
                                    </div>
                                </div>
                            </CCol>
                            <CCol xs="4">
                                <div class="hours-display">
                                    <label class="OT_hours">{{ totalBreakHours }} Hours</label>
                                </div>
                            </CCol>
                            <CCol xs="4">
                                <div class="time-picker-container">
                                    <label class="form-label">Break Duration</label>
                                    <div class="d-flex justify-content-center time-picker">
                                        <VueDatePicker v-model="timeBreakEnd" time-picker model-type="HH:mm"
                                            :enable-seconds="false" :is-24="true" placeholder="Select Time">
                                            <template #input-icon>
                                                <div class="icon-wrapper">
                                                    <img class="datepicker-icon" src="@/assets/clock.png" />
                                                </div>
                                            </template>
                                        </VueDatePicker>
                                    </div>
                                </div>
                            </CCol>
                        </CRow>
                    </div>
                </CCol>
            </CRow>

            <CRow class="justify-content-center mb-4">
                <CCol xs="12" md="8">
                    <div class="reason-section">
                        <h5 class="section-title">Overtime Reason</h5>
                        <CFormTextarea v-model="overtimeReason"
                            placeholder="Please provide detailed reason for overtime request" class="custom-textarea"
                            :rows="4" />
                    </div>
                </CCol>
            </CRow>

            <CRow class="justify-content-center">
                <CButton color="primary" class="submit-button">
                    Submit Request
                </CButton>
            </CRow>
        </CContainer>
    </div>
</template>

<script>
import { useOvertimeForm } from '@/utils/useOvertimeForm'
import VueDatePicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'

export default {
    name: 'OvertimeView',
    components: {
        VueDatePicker,
    },
    setup() {
        const form = useOvertimeForm()
        return {
            ...form
        }
    },
    async created() {
        await this.loadInitialData()
    }
}
</script>


<style scoped>
.overtime-container {
    max-width: 1000px;
    margin: 1rem auto;
    padding: 1.5rem;
    background-color: #ffffff;
    border-radius: 12px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.page-title {
    color: #2c3e50;
    font-size: 1.8rem;
    font-weight: 600;
    text-align: center;
    margin-bottom: 1.5rem;
}

.form-container {
    padding: 0.5rem;
}

.form-section {
    background-color: #f8f9fa;
    padding: 1rem;
    border-radius: 8px;
    margin-bottom: 0.75rem;
}

.form-label {
    font-weight: 500;
    color: #495057;
    margin-bottom: 0.25rem;
}

.custom-input {
    border: 1px solid #ced4da;
    border-radius: 6px;
    padding: 0.5rem;
    width: 100%;
    transition: border-color 0.2s;
}

.custom-input:focus {
    border-color: #80bdff;
    box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
}

.time-section {
    background-color: #f8f9fa;
    padding: 1rem;
    border-radius: 8px;
}

.time-block {
    text-align: center;
    padding: 0.5rem;
}

.time-picker {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 0.5rem;
}

.hours-display {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    padding: 0.5rem;
}

.break-section {
    background-color: #f8f9fa;
    padding: 1rem;
    border-radius: 8px;
}

.custom-checkbox {
    font-size: 1rem;
    margin-bottom: 0.5rem;
}

.checkbox-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    margin: 1rem 0;
}

.reason-section {
    background-color: #f8f9fa;
    padding: 1rem;
    border-radius: 8px;
}

.section-title {
    color: #2c3e50;
    margin-bottom: 0.75rem;
    font-size: 1.1rem;
}

.custom-textarea {
    border: 1px solid #ced4da;
    border-radius: 6px;
    padding: 0.75rem;
    width: 100%;
    resize: none;
}

.submit-button {
    padding: 0.75rem 2rem;
    font-size: 1.1rem;
    border-radius: 6px;
    min-width: 150px;
    transition: all 0.3s;
}

.submit-button:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.credentials {
    font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
    font-size: 1rem;
    font-weight: 600;
}

.clock-input {
    width: 80px;
    text-align: center;
}

.date-input {
    text-align: center;
}

.datepicker-icon {
    width: 20px;
    height: 20px;
    object-fit: contain;
    vertical-align: middle;
}

.icon-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    padding: 0 8px;
}

.break-row {
    transition: all 0.3s ease;
    overflow: hidden;
}

.OT_hours {
    font-size: 1.2rem;
    font-weight: 600;
    margin-top: 0.75rem;
}
</style>