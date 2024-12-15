import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

// CoreUI
import CoreuiVue from '@coreui/vue'
import CIcon from '@coreui/icons-vue'
import { iconsSet as icons } from '@coreui/icons'
import '@coreui/coreui/dist/css/coreui.min.css'
import 'bootstrap/dist/css/bootstrap.min.css'

const app = createApp(App)
app.use(router)
app.component('CIcon', CIcon)
app.provide('icons', icons)
app.use(CoreuiVue)
app.mount('#app')
