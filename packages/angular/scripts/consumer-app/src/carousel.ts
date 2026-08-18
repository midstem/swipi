import {
  Component,
  computed,
  effect,
  ElementRef,
  viewChild
} from '@angular/core'
import { useSwipiCarousel } from '@midstem/swipi-angular'
import type { SwipiCarouselSignal } from '@midstem/swipi-angular'

export const SLIDES = ['one', 'two', 'three', 'four']

const SLIDE_WIDTH = 300

@Component({
  selector: 'app-carousel',
  template: `
    <section>
      <div id="viewport" #viewport>
        <div id="track">
          @for (slide of slides; track slide) {
            <article>{{ slide }}</article>
          }
        </div>
      </div>

      <button id="next" (click)="carousel().scrollNext()">next</button>

      <p id="state">{{ state() }}</p>
    </section>
  `
})
export class CarouselComponent {
  readonly slides = SLIDES

  readonly viewport = viewChild<ElementRef<HTMLElement>>('viewport')

  readonly carousel: SwipiCarouselSignal

  readonly state = computed(() => {
    const { selectedIndex, snapCount, slidesCount } = this.carousel()

    return `${selectedIndex}/${snapCount}/${slidesCount}`
  })

  constructor() {
    const [carouselRef, carousel] = useSwipiCarousel({
      slideWidth: SLIDE_WIDTH
    })

    this.carousel = carousel

    effect(() => carouselRef(this.viewport()))
  }
}
