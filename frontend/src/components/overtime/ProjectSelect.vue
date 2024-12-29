<template>
    <CRow class="justify-content-center mb-3">
        <CCol xs="12" md="8">
            <CRow class="align-items-center mb-2">
                <CCol xs="3" class="text-end">
                    <label class="credentials">PROJECT</label>
                </CCol>
                <CCol xs="9">
                    <CFormSelect class="text-center" :value="selectedProject"
                        @change="$emit('update:selectedProject', $event.target.value)">
                        <option value="">Select Project</option>
                        <option v-for="project in projects" :key="project.id" :value="project.id">
                            {{ project.name }}
                        </option>
                    </CFormSelect>
                </CCol>
            </CRow>
        </CCol>
    </CRow>
</template>

<script setup>
defineProps({
    projects: {
        type: Array,
        required: true
    },
    selectedProject: {
        type: String,
        default: ''
    }
})
</script>