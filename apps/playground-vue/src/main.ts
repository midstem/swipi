import { createApp } from 'vue'
import App from './App.vue'
import { startEmbedBridge } from '@swipi/playground-core'
import '@swipi/playground-core/playground.css'

createApp(App).mount('#root')

startEmbedBridge()
