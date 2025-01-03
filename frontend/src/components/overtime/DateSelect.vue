<template>
    <CRow class="justify-content-center mb-3">
        <CCol xs="12" md="8">
            <CRow class="align-items-center mb-2">
                <CCol xs="3" class="text-end">
                    <label class="credentials">DATE</label>
                </CCol>
                <CCol xs="6">
                    <input type="date" class="form-control text-center" :value="selectedDate"
                        @input="$emit('update:selectedDate', $event.target.value)" />
                </CCol>
                <CCol xs="3">
                    <CFormCheck :model-value="isHoliday" @update:model-value="$emit('update:isHoliday', $event)"
                        id="holidayCheck" label="Holiday" class="custom-checkbox" />
                </CCol>
            </CRow>
        </CCol>
    </CRow>
</template>

<script setup>
defineProps({
    selectedDate: {
        type: String,
        required: true
    },
    isHoliday: {
        type: Boolean,
        default: false
    }
})
</script>

<style scoped>
input[type="date"] {
    padding: 0.375rem 0.75rem;
    border: 1px solid #ced4da;
    border-radius: 4px;
}

input[type="date"]::-webkit-calendar-picker-indicator {
    cursor: pointer;
}
</style>