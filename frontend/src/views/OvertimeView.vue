<template>
    <div class="overtime-container">
        <h1 class="text-center mb-4">OVERTIME PAGE</h1>
        <CContainer>
            <CRow class="justify-content-center mb-3">
                <CCol xs="12" md="8">
                    <CRow class="align-items-center">
                        <CCol xs="3" class="text-end">
                            <label class="credentials">NAME</label>
                        </CCol>
                        <CCol xs="9">
                            <CFormSelect class="text-center">
                                <option value="">Otniel Dwimarti #1</option>
                                <option value="">Otniel Dwimarti #2</option>
                                <option value="">Otniel Dwimarti #3</option>
                                <option value="">Otniel Dwimarti #4</option>
                            </CFormSelect>
                        </CCol>
                    </CRow>
                </CCol>
            </CRow>

            <CRow class="justify-content-center mb-3">
                <CCol xs="12" md="8">
                    <CRow class="align-items-center">
                        <CCol xs="3" class="text-end">
                            <label class="credentials">ID</label>
                        </CCol>
                        <CCol xs="9">
                            <label class="credentials text-center d-block">MW2202033</label>
                        </CCol>
                    </CRow>
                </CCol>
            </CRow>

            <CRow class="justify-content-center mb-3">
                <CCol xs="12" md="8">
                    <CRow class="align-items-center">
                        <CCol xs="3" class="text-end">
                            <label class="credentials">PROJECT</label>
                        </CCol>
                        <CCol xs="9">
                            <CFormSelect class="text-center">
                                <option value="">PTB Project #1</option>
                                <option value="">PTB Project #2</option>
                                <option value="">PTB Project #3</option>
                                <option value="">PTB Project #4</option>
                            </CFormSelect>
                        </CCol>
                    </CRow>
                </CCol>
            </CRow>

            <CRow class="justify-content-center mb-3">
                <CCol xs="12" md="8">
                    <label class="d-block text-center mb-2">Select Date</label>
                    <div class="d-flex justify-content-center">
                        <CFormInput type="date" class="text-center date-input" style="width: 300px;" />
                    </div>
                </CCol>
            </CRow>

            <CRow class="justify-content-center mb-3">
                <CCol xs="12" md="10">
                    <CRow>
                        <CCol xs="4" class="text-center">
                            <label>Start of OT Hour</label>
                            <div class="d-flex justify-content-center">
                                <CFormSelect v-model="selectedHourStart" class="clock-input mx-1">
                                    <option value="">17</option>
                                    <option v-for="hour in hours" :key="hour" :value="hour">
                                        {{ hour.toString().padStart(2, '0') }}
                                    </option>
                                </CFormSelect>
                                <span class="align-self-center">:</span>
                                <CFormSelect v-model="selectedMinuteStart" class="clock-input mx-1">
                                    <option value="">20</option>
                                    <option v-for="minute in minuteOptions" :key="minute" :value="minute">
                                        {{ minute.toString().padStart(2, '0') }}
                                    </option>
                                </CFormSelect>
                            </div>
                        </CCol>
                        <CCol xs="4" class="text-center">
                            <label class="OT_hours">0 Hours</label>
                        </CCol>
                        <CCol xs="4" class="text-center">
                            <label>End of OT Hour</label>
                            <div class="d-flex justify-content-center">
                                <CFormSelect v-model="selectedHourEnd" class="clock-input mx-1">
                                    <option value="">18</option>
                                    <option v-for="hour in hours" :key="hour" :value="hour">
                                        {{ hour.toString().padStart(2, '0') }}
                                    </option>
                                </CFormSelect>
                                <span class="align-self-center">:</span>
                                <CFormSelect v-model="selectedMinuteEnd" class="clock-input mx-1">
                                    <option value="">20</option>
                                    <option v-for="minute in minuteOptions" :key="minute" :value="minute">
                                        {{ minute.toString().padStart(2, '0') }}
                                    </option>
                                </CFormSelect>
                            </div>
                        </CCol>
                    </CRow>
                </CCol>
            </CRow>

            <CRow class="justify-content-center mb-3">
                <CCol xs="12" md="8" class="text-center">
                    <CFormCheck hitArea="full" label="Have Break" class="d-inline-block" />
                </CCol>
                <CCol xs="12" md="8" class="text-center">
                    <label>Break Hour</label>
                    <div class="d-flex justify-content-center">
                        <CFormSelect v-model="selectedHourEnd" class="clock-input mx-1">
                            <option value="">18</option>
                            <option v-for="hour in hours" :key="hour" :value="hour">
                                {{ hour.toString().padStart(2, '0') }}
                            </option>
                        </CFormSelect>
                        <span class="align-self-center">:</span>
                        <CFormSelect v-model="selectedMinuteEnd" class="clock-input mx-1">
                            <option value="">20</option>
                            <option v-for="minute in minuteOptions" :key="minute" :value="minute">
                                {{ minute.toString().padStart(2, '0') }}
                            </option>
                        </CFormSelect>
                    </div>
                </CCol>
            </CRow>

            <CRow class="justify-content-center mb-3">
                <CCol xs="12" md="8">
                    <h5 class="text-center mb-3">Overtime Reason</h5>
                    <CFormTextarea v-model="overtimeReason" placeholder="Enter overtime reason" :rows="4"
                        class="text-center" style="resize: none;" />
                </CCol>
            </CRow>
        </CContainer>
    </div>
</template>

<script setup>
import { ref } from 'vue'

const selectedHourStart = ref('')
const selectedMinuteStart = ref('')
const selectedHourEnd = ref('')
const selectedMinuteEnd = ref('')
const overtimeReason = ref('')

const hours = Array.from({ length: 24 }, (_, i) => i)
const minuteOptions = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55]
</script>

<style scoped>
.overtime-container {
    max-width: 900px;
    margin: 0 auto;
    padding: 20px;
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

.OT_hours {
    font-size: 1.2rem;
    font-weight: 600;
    margin-top: 30px;
}
</style>