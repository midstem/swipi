import { Component, computed, input, signal } from '@angular/core'
import {
  STYLES,
  FIRST_INDEX,
  JSON_INDENT,
  clampIndex,
  getLastIndex
} from '@swipi/playground-core'
import type { CarouselRef, ImperativeReadings } from '@swipi/playground-core'

const RADIX = 10

@Component({
  selector: 'pg-imperative-api',
  styles: ':host { display: contents; }',
  template: `
    <div [class]="STYLES.card">
      <h2 [class]="STYLES.cardTitle">Carousel methods</h2>
      <div [class]="STYLES.row">
        <button type="button" [class]="STYLES.button" (click)="scrollPrev()">
          scrollPrev()
        </button>
        <button type="button" [class]="STYLES.button" (click)="scrollNext()">
          scrollNext()
        </button>
        <span [class]="STYLES.rowGroup">
          <input
            type="number"
            [class]="STYLES.numberInput"
            aria-label="Slide index for scrollTo"
            [min]="firstIndex"
            [max]="lastIndex()"
            [value]="index()"
            (change)="changeIndex($event)"
            (input)="changeIndex($event)"
          />
          <button type="button" [class]="STYLES.button" (click)="scrollTo()">
            scrollTo(index)
          </button>
        </span>
        <button
          type="button"
          [class]="STYLES.ghostButton"
          (click)="readState()"
        >
          Read carousel state
        </button>
      </div>
      @if (readings()) {
        <pre [class]="STYLES.code">{{ readingsStr() }}</pre>
      }
    </div>
  `
})
export class ImperativeApi {
  protected readonly STYLES = STYLES

  readonly carousel = input.required<CarouselRef | null>()

  readonly slidesCount = input.required<number>()

  readonly index = signal(FIRST_INDEX)

  readonly readings = signal<ImperativeReadings | undefined>(undefined)

  readonly firstIndex = FIRST_INDEX

  readonly lastIndex = computed(() => getLastIndex(this.slidesCount()))

  readonly readingsStr = computed(() =>
    JSON.stringify(this.readings(), null, JSON_INDENT)
  )

  changeIndex(event: Event): void {
    const { value } = event.target as HTMLInputElement

    this.index.set(clampIndex(parseInt(value, RADIX), this.slidesCount()))
  }

  scrollPrev(): void {
    this.carousel()?.scrollPrev()
  }

  scrollNext(): void {
    this.carousel()?.scrollNext()
  }

  scrollTo(): void {
    this.carousel()?.scrollTo(this.index())
  }

  readState(): void {
    const carousel = this.carousel()

    if (!carousel) return

    this.readings.set({
      canScrollNext: carousel.canScrollNext(),
      canScrollPrev: carousel.canScrollPrev(),
      scrollSnapList: carousel.scrollSnapList(),
      selectedScrollSnap: carousel.selectedScrollSnap()
    })
  }
}
