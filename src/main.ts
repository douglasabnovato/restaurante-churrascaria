import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { carregarMedicao } from './services/medicao'

carregarMedicao()

createApp(App).mount('#app')
