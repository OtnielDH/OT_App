<template>
    <CRow class="justify-content-center mb-4">
        <CCol xs="12" md="8">
            <div class="reason-section">
                <h5 class="section-title">Overtime Reason</h5>
                <CFormTextarea :model-value="reason" @update:model-value="$emit('update:reason', $event)"
                    placeholder="Please provide detailed reason for overtime request" class="custom-textarea"
                    :rows="4" />
            </div>
        </CCol>
    </CRow>
</template>

<script setup>
defineProps({
    reason: {
        type: String,
        default: ''
    }
})
</script>