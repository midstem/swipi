import { mount } from 'svelte'
import App from './App.svelte'
import { startEmbedBridge } from '@swipi/playground-core'
import '@swipi/playground-core/playground.css'

mount(App, { target: document.getElementById('root') as HTMLElement })

startEmbedBridge()
