import {
  Component,
  computed,
  effect,
  ElementRef,
  input,
  output,
  viewChild
} from '@angular/core'
import type { OnInit } from '@angular/core'
import { useSwipiCarousel } from '@midstem/swipi-angular'
import type {
  SlidePositions,
  SwipiCarouselSignal,
  SwipiState
} from '@midstem/swipi-angular'
import {
  VERTICAL_AXIS,
  getActiveBreakpoint,
  getArrows,
  getBias,
  getConfig,
  getSlideStyle,
  getSlideWidth,
  getSpaceBetween,
  getTrackStyle,
  getViewportStyle,
  getVisibleSlides,
  isNextKey,
  isPreviousKey
} from '@swipi/playground-core'
import type { CarouselRef, PlaygroundState } from '@swipi/playground-core'
import { toRange, toStyle } from '../../helpers'
import { useWindowWidth } from '../../hooks/useWindowWidth'

const PREVIOUS_ARROW = 0

const NEXT_ARROW = 1

@Component({
  selector: 'pg-stage',
  styles: ':host { display: contents; }',
  template: `
    <div class="pg-card">
      <div class="pg-stage__slider" [style]="sliderStyle()">
        <div class="pg-carousel" [class.pg-carousel--vertical]="isVertical()">
          <span
            class="pg-visually-hidden"
            aria-live="polite"
            aria-atomic="true"
          >
            Slide {{ carousel().selectedIndex + 1 }} of
            {{ carousel().snapCount }}
          </span>

          <div class="pg-carousel__row">
            @if (showArrows()) {
              <button
                type="button"
                class="pg-carousel__arrow"
                aria-label="Previous slide"
                [disabled]="!carousel().canScrollPrev"
                (click)="carousel().scrollPrev()"
              >
                {{ previousArrow() }}
              </button>
            }

            <div
              #viewport
              class="pg-carousel__viewport"
              [style]="viewportStyle()"
              role="group"
              tabindex="0"
              aria-roledescription="carousel"
              [attr.aria-label]="state().ariaLabel"
              (keydown)="handleKeyDown($event)"
            >
              <div class="pg-carousel__track" [style]="trackStyle()">
                @for (color of slides(); track color; let index = $index) {
                  <div
                    class="pg-carousel__slide"
                    role="group"
                    aria-roledescription="slide"
                    attr.aria-label="{{ index + 1 }} of {{ slides().length }}"
                    [style]="slideStyle(index)"
                  >
                    <div
                      class="pg-carousel__slide-box"
                      [style.background-color]="color"
                    >
                      {{ index + 1 }}
                    </div>
                  </div>
                }
              </div>
            </div>

            @if (showArrows()) {
              <button
                type="button"
                class="pg-carousel__arrow"
                aria-label="Next slide"
                [disabled]="!carousel().canScrollNext"
                (click)="carousel().scrollNext()"
              >
                {{ nextArrow() }}
              </button>
            }
          </div>

          @if (state().showDots) {
            <nav class="pg-carousel__dots">
              @for (index of dots(); track index) {
                <button
                  type="button"
                  class="pg-carousel__dot"
                  attr.aria-label="Go to slide {{ index + 1 }}"
                  [attr.aria-current]="index === carousel().selectedIndex"
                  (click)="carousel().scrollTo(index)"
                >
                  <span
                    class="pg-carousel__dot-mark"
                    [attr.data-active]="index === carousel().selectedIndex"
                    [style.transition]="state().animationSpeed + 'ms'"
                  ></span>
                </button>
              }
            </nav>
          }
        </div>
      </div>

      <ul class="pg-facts">
        <li>
          window width: <b>{{ windowWidth() }}px</b>
        </li>
        <li>
          visible slides: <b>{{ visibleSlides() }}</b>
        </li>
        <li>
          snap positions: <b>{{ carousel().snapCount }}</b>
        </li>
        <li>
          active breakpoint: <b>{{ breakpoint() }}</b>
        </li>
      </ul>

      @if (!carousel().hasOverflow) {
        <p class="pg-warning">
          All slides fit on the screen, so arrows, dots navigation and
          <code>loop</code> are disabled — add more slides, decrease
          <code>slidesNumber</code> or narrow the stage.
        </p>
      }
    </div>
  `
})
export class Stage implements OnInit {
  readonly state = input.required<PlaygroundState>()

  readonly slides = input.required<string[]>()

  readonly selected = output<SwipiState>()

  readonly changed = output<SlidePositions>()

  readonly ready = output<CarouselRef>()

  readonly viewport = viewChild<ElementRef<HTMLElement>>('viewport')

  readonly windowWidth = useWindowWidth()

  readonly carousel: SwipiCarouselSignal

  readonly config = computed(() => getConfig(this.state()))

  readonly isVertical = computed(() => this.state().axis === VERTICAL_AXIS)

  readonly visibleSlides = computed(() =>
    getVisibleSlides(this.state(), this.config(), this.windowWidth())
  )

  readonly slideWidth = computed(() => getSlideWidth(this.state()))

  readonly spaceBetween = computed(() =>
    getSpaceBetween(this.state(), this.config(), this.windowWidth())
  )

  readonly bias = computed(() =>
    getBias(
      this.state(),
      this.config(),
      this.windowWidth(),
      this.visibleSlides()
    )
  )

  readonly breakpoint = computed(() => {
    const active = getActiveBreakpoint(this.config(), this.windowWidth())

    return active ? `maxWidth ${active.maxWidth}` : 'none'
  })

  readonly sliderStyle = computed(() => `width: ${this.state().stageWidth}px`)

  readonly viewportStyle = computed(() =>
    toStyle(getViewportStyle(this.state(), this.isVertical()))
  )

  readonly trackStyle = computed(() =>
    toStyle(getTrackStyle(this.visibleSlides(), this.bias(), this.slideWidth()))
  )

  readonly showArrows = computed(
    () => this.state().showArrows && this.carousel().hasOverflow
  )

  readonly previousArrow = computed(
    () => getArrows(this.isVertical())[PREVIOUS_ARROW]
  )

  readonly nextArrow = computed(() => getArrows(this.isVertical())[NEXT_ARROW])

  readonly dots = computed(() => toRange(this.carousel().snapCount))

  constructor() {
    const [carouselRef, carousel] = useSwipiCarousel(
      computed(() => ({
        axis: this.state().axis,
        loop: this.state().loop,
        dragFree: this.state().dragFree,
        autoplay: this.state().autoplay,
        startIndex: this.state().startIndex,
        autoplaySpeed: this.state().autoplaySpeed,
        animationSpeed: this.state().animationSpeed,
        respectReducedMotion: this.state().respectReducedMotion,
        slideWidth: this.slideWidth(),
        spaceBetween: this.spaceBetween(),
        onSelect: (state: SwipiState) => this.selected.emit(state),
        onChange: (positions: SlidePositions) => this.changed.emit(positions)
      }))
    )

    this.carousel = carousel

    effect(() => carouselRef(this.viewport()))
  }

  ngOnInit(): void {
    this.ready.emit({
      scrollNext: () => this.carousel().scrollNext(),
      scrollPrev: () => this.carousel().scrollPrev(),
      scrollTo: (index: number) => this.carousel().scrollTo(index),
      selectedScrollSnap: () => this.carousel().selectedIndex,
      scrollSnapList: () => toRange(this.carousel().snapCount),
      canScrollNext: () => this.carousel().canScrollNext,
      canScrollPrev: () => this.carousel().canScrollPrev
    })
  }

  slideStyle(index: number): string {
    return toStyle(
      getSlideStyle(this.state(), index === this.carousel().selectedIndex)
    )
  }

  handleKeyDown(event: KeyboardEvent): void {
    if (isPreviousKey(event.key, this.isVertical())) {
      this.carousel().scrollPrev()
    }

    if (isNextKey(event.key, this.isVertical())) this.carousel().scrollNext()
  }
}
