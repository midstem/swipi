import { provideZonelessChangeDetection } from '@angular/core'
import { bootstrapApplication } from '@angular/platform-browser'
import { App } from './app'
import '@swipi/playground-core/playground.css'

void bootstrapApplication(App, {
  providers: [provideZonelessChangeDetection()]
})
