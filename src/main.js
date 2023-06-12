import { createApp } from 'vue'
import { createPinia } from 'pinia'
import "./assets/init.css"

import App from './App.vue'
import router from './router'
import focusDirective from "./directives/directive"

const app = createApp(App)

app.use(focusDirective)
app.use(createPinia())
app.use(router)

app.mount('#app')
