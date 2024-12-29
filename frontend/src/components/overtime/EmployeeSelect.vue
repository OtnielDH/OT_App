<template>
    <CRow class="justify-content-center mb-3">
        <CCol xs="12" md="8">
            <CRow class="align-items-center mb-2">
                <CCol xs="3" class="text-end">
                    <label class="credentials">NAME</label>
                </CCol>
                <CCol xs="9">
                    <CFormSelect class="text-center" :value="selectedEmployee"
                        @change="$emit('update:selectedEmployee', $event.target.value)">
                        <option value="">Select Employees</option>
                        <option v-for="employee in employees" :key="employee.id" :value="employee.id">
                            {{ employee.name }}
                        </option>
                    </CFormSelect>
                </CCol>
            </CRow>
            <CRow class="align-items-center mb-2">
                <CCol xs="3" class="text-end">
                    <label class="credentials">ID</label>
                </CCol>
                <CCol xs="9">
                    <label class="credentials text-center d-block">{{ employeeId }}</label>
                </CCol>
            </CRow>
        </CCol>
    </CRow>
</template>

<script setup>
defineProps({
    employees: {
        type: Array,
        required: true
    },
    selectedEmployee: {
        type: String,
        default: ''
    },
    employeeId: {
        type: String,
        default: 'MW-------'
    }
})
</script>