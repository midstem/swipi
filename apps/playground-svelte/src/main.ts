import { mount } from 'svelte'
import App from './App.svelte'
import '@swipi/playground-core/playground.css'

mount(App, { target: document.getElementById('root') as HTMLElement })
