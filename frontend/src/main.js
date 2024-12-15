import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

// CoreUI
import '@coreui/coreui/dist/css/coreui.min.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import "@coreui/icons/css/all.min.css"
import CoreuiVue from '@coreui/vue'
import CIcon from '@coreui/icons-vue'
import * as icons from '@coreui/icons'


const app = createApp(App)
app.use(router)
app.provide('icons', icons)
app.component('CIcon', CIcon)
app.use(CoreuiVue)
app.mount('#app')
