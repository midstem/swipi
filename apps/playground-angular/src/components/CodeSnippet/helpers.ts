import {
  ARROWS,
  KEYS,
  getClassNames,
  getOptions,
  isFadeInAnimation
} from '@swipi/playground-core'
import type { ClassNames, PlaygroundState } from '@swipi/playground-core'

const buildImports = (state: PlaygroundState): string => {
  const symbols = ['Component', 'effect', 'ElementRef', 'input', 'viewChild']

  if (state.showDots) symbols.splice(1, 0, 'computed')

  return `import { ${symbols.join(', ')} } from '@angular/core'`
}

const buildSelected = (state: PlaygroundState): string =>
  isFadeInAnimation(state.slidesAnimation)
    ? `
            [attr.data-selected]="index === carousel().selectedIndex"`
    : ''

const buildSlide = (state: PlaygroundState, classes: ClassNames): string => {
  const selected = buildSelected(state)

  return `        @for (item of items(); track item.id; let index = $index) {
          <div
            class="${classes.slide}"
            role="group"
            aria-roledescription="slide"
            attr.aria-label="{{ index + 1 }} of {{ items().length }}"${selected}
          >
            {{ item.title }}
          </div>
        }`
}

const buildMinimalSlide = (
  state: PlaygroundState,
  classes: ClassNames
): string => {
  const selected = buildSelected(state)

  if (!selected) {
    return `        @for (item of items(); track item.id) {
          <div class="${classes.slide}">{{ item.title }}</div>
        }`
  }

  return `        @for (item of items(); track item.id; let index = $index) {
          <div class="${classes.slide}"${selected}>
            {{ item.title }}
          </div>
        }`
}

const buildArrows = (state: PlaygroundState, minimal: boolean): string => {
  if (!state.showArrows) return ''

  const [previous, next] = ARROWS[state.axis]

  const label = (text: string): string =>
    minimal
      ? ''
      : `
        aria-label="${text}"`

  return `

      <button
        type="button"${label('Previous slide')}
        [disabled]="!carousel().canScrollPrev"
        (click)="carousel().scrollPrev()"
      >
        ${previous}
      </button>
      <button
        type="button"${label('Next slide')}
        [disabled]="!carousel().canScrollNext"
        (click)="carousel().scrollNext()"
      >
        ${next}
      </button>`
}

const buildDots = (state: PlaygroundState, minimal: boolean): string => {
  if (!state.showDots) return ''

  const marker = minimal
    ? `
          [attr.data-active]="index === carousel().selectedIndex"`
    : `
          attr.aria-label="Go to slide {{ index + 1 }}"
          [attr.aria-current]="index === carousel().selectedIndex"`

  return `

      @for (index of dots(); track index) {
        <button
          type="button"
          class="carousel__dot"${marker}
          (click)="carousel().scrollTo(index)"
        ></button>
      }`
}

const buildStatus = (classes: ClassNames): string => `

      <span class="${classes.status}" aria-live="polite" aria-atomic="true">
        Slide {{ carousel().selectedIndex + 1 }} of {{ carousel().snapCount }}
      </span>`

const buildViewport = (
  state: PlaygroundState,
  classes: ClassNames,
  minimal: boolean
): string => {
  if (minimal) {
    return `      <div #viewport class="${classes.viewport}">`
  }

  return `      <div
        #viewport
        class="${classes.viewport}"
        role="group"
        tabindex="0"
        aria-roledescription="carousel"
        aria-label="${state.ariaLabel}"
        (keydown)="handleKeyDown($event)"
      >`
}

const buildTemplate = (
  state: PlaygroundState,
  classes: ClassNames,
  minimal: boolean
): string => {
  const slides = minimal
    ? buildMinimalSlide(state, classes)
    : buildSlide(state, classes)

  const status = minimal ? '' : buildStatus(classes)

  return `${buildViewport(state, classes, minimal)}
        <div class="${classes.track}">
${slides}
        </div>
      </div>${status}${buildArrows(state, minimal)}${buildDots(state, minimal)}`
}

const buildDotsField = (state: PlaygroundState): string => {
  if (!state.showDots) return ''

  return `

  readonly dots = computed(() =>
    Array.from({ length: this.carousel().snapCount }, (_, index) => index)
  )`
}

const buildKeyboard = (state: PlaygroundState, minimal: boolean): string => {
  if (minimal) return ''

  const [previousKey, nextKey] = KEYS[state.axis]

  return `

  handleKeyDown(event: KeyboardEvent): void {
    if (event.key === '${previousKey}') this.carousel().scrollPrev()
    if (event.key === '${nextKey}') this.carousel().scrollNext()
  }`
}

export const buildMarkup = (
  state: PlaygroundState,
  minimal = false,
  tailwind = false
): string => {
  const classes = getClassNames(state, tailwind)
  const options = getOptions(state)

  return `${buildImports(state)}
import { useSwipiCarousel } from '@midstem/swipi-angular'
import type { SwipiCarouselSignal } from '@midstem/swipi-angular'

type Item = { id: string; title: string }

@Component({
  selector: 'app-carousel',
  template: \`
${buildTemplate(state, classes, minimal)}
  \`
})
export class CarouselComponent {
  readonly items = input<Item[]>([])

  readonly viewport = viewChild<ElementRef<HTMLElement>>('viewport')

  readonly carousel: SwipiCarouselSignal${buildDotsField(state)}

  constructor() {
    const [carouselRef, carousel] = useSwipiCarousel(${options})

    this.carousel = carousel

    effect(() => carouselRef(this.viewport()))
  }${buildKeyboard(state, minimal)}
}
`
}
