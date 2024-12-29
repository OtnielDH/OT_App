<template>
    <CContainer class="overtime-form">
        <EmployeeSelect :employees="activeEmployees" :selectedEmployee="selectedEmployees"
            :employeeId="selectedEmployeeId" @update:selectedEmployee="$emit('update:selectedEmployees', $event)" />

        <ProjectSelect :projects="projects" :selectedProject="selectedProjects"
            @update:selectedProject="$emit('update:selectedProjects', $event)" />

        <DateSelect v-model="selectedDate" @update:modelValue="$emit('update:selectedDate', $event)" />

        <TimeSection :timeStart="timeStart" :timeEnd="timeEnd" :totalHours="totalHours"
            @update:timeStart="$emit('update:timeStart', $event)" @update:timeEnd="$emit('update:timeEnd', $event)" />

        <BreakSection :hasBreak="hasBreak" :timeBreakStart="timeBreakStart" :timeBreakEnd="timeBreakEnd"
            :totalBreakHours="totalBreakHours" @update:hasBreak="$emit('update:hasBreak', $event)"
            @update:timeBreakStart="$emit('update:timeBreakStart', $event)"
            @update:timeBreakEnd="$emit('update:timeBreakEnd', $event)" />

        <ReasonSection :reason="overtimeReason" @update:reason="$emit('update:overtimeReason', $event)" />

        <CButton color="primary" class="submit-button" @click="$emit('submit')" :disabled="submitting">
            {{ submitting ? 'Submitting...' : 'Submit Request' }}
        </CButton>
    </CContainer>
</template>

<script setup>
import EmployeeSelect from './EmployeeSelect.vue'
import ProjectSelect from './ProjectSelect.vue'
import TimeSection from './TimeSection.vue'
import BreakSection from './BreakSection.vue'
import ReasonSection from './ReasonSection.vue'
import DateSelect from './DateSelect.vue'

defineProps({
    activeEmployees: Array,
    selectedEmployees: String,
    employeeId: String,
    projects: Array,
    selectedProjects: String,
    selectedDate: String,
    timeStart: String,
    timeEnd: String,
    totalHours: String,
    hasBreak: Boolean,
    timeBreakStart: String,
    timeBreakEnd: String,
    totalBreakHours: String,
    overtimeReason: String,
    submitting: Boolean
})
</script>