import { bootstrapApplication } from '@angular/platform-browser'
import type { BootstrapContext } from '@angular/platform-browser'
import { provideServerRendering } from '@angular/ssr'
import { CarouselComponent } from './carousel'

export default (context: BootstrapContext) =>
  bootstrapApplication(
    CarouselComponent,
    { providers: [provideServerRendering()] },
    context
  )
