import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import Toast from 'vue-toastification'

// CoreUI
import CoreuiVue from '@coreui/vue'
import CIcon from '@coreui/icons-vue'
import * as icons from '@coreui/icons'
import '@coreui/coreui/dist/css/coreui.min.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import "@coreui/icons/css/all.min.css"

// Vue Datepicker
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';

const app = createApp(App)
app.use(Toast, {
    position: 'top-right',
    timeout: 3000
})
app.use(router)
app.provide('icons', icons)
app.component('VueDatePicker', VueDatePicker)
app.component('CIcon', CIcon)
app.use(CoreuiVue)
app.mount('#app')
