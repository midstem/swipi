import { createApp } from './app'
import { startEmbedBridge } from '@swipi/playground-core'
import '@swipi/playground-core/playground.css'

const root = document.getElementById('root') as HTMLElement

createApp(root)

startEmbedBridge()
