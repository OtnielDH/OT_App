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
                        <CFormInput type="date" class="custom-input date-input" v-model="selectedDate" />
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
                <CButton color="primary" class="submit-button" @click="submitOvertimeRequest" :disabled="submitting">
                    {{ submitting ? 'Submitting...' : 'Submit Request' }}
                </CButton>
            </CRow>
        </CContainer>
    </div>
</template>

<script>
import { useOvertimeForm } from '@/utils/useOvertimeForm'
import VueDatePicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'
import '@/assets/styles/overtime.scss'

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