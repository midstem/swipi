import {
  bootstrapApplication,
  provideClientHydration
} from '@angular/platform-browser'
import { CarouselComponent } from './carousel'

bootstrapApplication(CarouselComponent, {
  providers: [provideClientHydration()]
})
