import { createSwipi } from '@midstem/swipi'
import type { SwipiOptions } from '@midstem/swipi'
import {
  STYLES,
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
import type {
  PlaygroundState,
  StageProps,
  UseStageReturn
} from '@swipi/playground-core'
import { applyStyle, clear, element, setText } from '../../dom'
import { toRange } from '../../helpers'
import type { StageComponent } from '../../types'

const FIRST_SLIDE_OFFSET = 1

const OPTION_KEYS = [
  'axis',
  'loop',
  'dragFree',
  'autoplay',
  'startIndex',
  'autoplaySpeed',
  'animationSpeed',
  'respectReducedMotion',
  'slideWidth',
  'spaceBetween'
] as const

const toSignature = (options: SwipiOptions): string =>
  JSON.stringify(OPTION_KEYS.map((key) => options[key]))

const FACTS = [
  'window width',
  'visible slides',
  'snap positions',
  'active breakpoint'
]

const createFact = (title: string): [HTMLElement, HTMLElement] => {
  const value = element('b')

  return [element('li', {}, [`${title}: `, value]), value]
}

export const createStage = (props: StageProps): StageComponent => {
  let current = props
  let windowWidth = window.innerWidth
  let slideNodes: HTMLElement[] = []

  const track = element('div', { class: STYLES.track })

  const viewport = element(
    'div',
    {
      class: STYLES.viewport,
      'data-pg': 'viewport',
      role: 'group',
      tabindex: '0',
      'aria-roledescription': 'carousel'
    },
    [track]
  )

  const status = element('span', {
    class: STYLES.visuallyHidden,
    'aria-live': 'polite',
    'aria-atomic': 'true'
  })

  const arrows = ['Previous slide', 'Next slide'].map((label) =>
    element('button', {
      type: 'button',
      class: STYLES.arrow,
      'aria-label': label
    })
  )

  const [previous, next] = arrows

  const dots = element('nav', { class: STYLES.dots })

  const row = element('div', { class: STYLES.carouselRow }, [
    previous,
    viewport,
    next
  ])

  const carouselBox = element(
    'div',
    { class: STYLES.carousel, 'data-pg': 'carousel' },
    [status, row, dots]
  )

  const slider = element('div', { class: STYLES.slider }, [carouselBox])

  const facts = FACTS.map(createFact)

  const warning = element('p', { class: STYLES.warning }, [
    'All slides fit on the screen, so arrows, dots navigation and loop are disabled — add more slides, decrease slidesNumber or narrow the stage.'
  ])

  const card = element('div', { class: STYLES.card }, [
    slider,
    element(
      'ul',
      { class: STYLES.facts },
      facts.map(([item]) => item)
    ),
    warning
  ])

  const setAxis = (axis: string): void =>
    [row, viewport, track, ...slideNodes].forEach((node) =>
      node.setAttribute('data-axis', axis)
    )

  const buildSlides = (colors: string[]): void => {
    clear(track)

    slideNodes = colors.map((color, index) => {
      const box = element('div', { class: STYLES.slideBox }, [
        String(index + FIRST_SLIDE_OFFSET)
      ])

      box.style.backgroundColor = color

      return element(
        'div',
        {
          class: STYLES.slide,
          'data-pg': 'slide',
          role: 'group',
          'aria-roledescription': 'slide',
          'aria-label': `${index + FIRST_SLIDE_OFFSET} of ${colors.length}`
        },
        [box]
      )
    })

    track.append(...slideNodes)
  }

  const getDerived = (state: PlaygroundState): UseStageReturn => {
    const config = getConfig(state)
    const visibleSlides = getVisibleSlides(state, config, windowWidth)

    return {
      config,
      windowWidth,
      visibleSlides,
      isVertical: state.axis === VERTICAL_AXIS,
      slideWidth: getSlideWidth(state),
      spaceBetween: getSpaceBetween(state, config, windowWidth),
      bias: getBias(state, config, windowWidth, visibleSlides),
      activeBreakpoint: getActiveBreakpoint(config, windowWidth)
    }
  }

  const getOptions = (state: PlaygroundState): SwipiOptions => {
    const { slideWidth, spaceBetween } = getDerived(state)

    return {
      slideWidth,
      spaceBetween,
      axis: state.axis,
      loop: state.loop,
      dragFree: state.dragFree,
      autoplay: state.autoplay,
      startIndex: state.startIndex,
      autoplaySpeed: state.autoplaySpeed,
      animationSpeed: state.animationSpeed,
      respectReducedMotion: state.respectReducedMotion,
      onSelect: (value) => current.onSelect(value),
      onChange: (value) => current.onChange(value)
    }
  }

  buildSlides(props.slides)

  let optionsSignature = toSignature(getOptions(props.state))

  const carousel = createSwipi(viewport, getOptions(props.state))

  const syncOptions = (state: PlaygroundState): void => {
    const options = getOptions(state)
    const signature = toSignature(options)

    if (signature === optionsSignature) return

    optionsSignature = signature

    carousel.update(options)
  }

  const buildDots = (count: number): void => {
    clear(dots)

    dots.append(
      ...toRange(count).map((index) => {
        const mark = element('span', { class: STYLES.dotMark })

        const dot = element(
          'button',
          {
            type: 'button',
            class: STYLES.dot,
            'aria-label': `Go to slide ${index + FIRST_SLIDE_OFFSET}`
          },
          [mark]
        )

        dot.addEventListener('click', () => carousel.scrollTo(index))

        return dot
      })
    )
  }

  const renderDots = (selectedIndex: number, snapCount: number): void => {
    const { showDots, animationSpeed } = current.state

    dots.hidden = !showDots

    if (dots.children.length !== snapCount) buildDots(snapCount)

    Array.from(dots.children).forEach((dot, index) => {
      const isSelected = index === selectedIndex
      const mark = dot.firstElementChild as HTMLElement

      dot.setAttribute('aria-current', String(isSelected))
      mark.dataset.active = String(isSelected)
      mark.style.transition = `${animationSpeed}ms`
    })
  }

  const render = (): void => {
    const { state } = current
    const snapshot = carousel.getSnapshot()
    const derived = getDerived(state)
    const showArrows = state.showArrows && snapshot.hasOverflow
    const [previousArrow, nextArrow] = getArrows(derived.isVertical)

    setAxis(state.axis)

    applyStyle(slider, { width: state.stageWidth })
    applyStyle(viewport, getViewportStyle(state, derived.isVertical))
    applyStyle(
      track,
      getTrackStyle(derived.visibleSlides, derived.bias, derived.slideWidth)
    )

    viewport.setAttribute('aria-label', state.ariaLabel)

    slideNodes.forEach((slide, index) =>
      applyStyle(slide, getSlideStyle(state, index === snapshot.selectedIndex))
    )

    setText(
      status,
      `Slide ${snapshot.selectedIndex + FIRST_SLIDE_OFFSET} of ${snapshot.snapCount}`
    )

    setText(previous, previousArrow)
    setText(next, nextArrow)

    previous.hidden = !showArrows
    next.hidden = !showArrows
    previous.disabled = !snapshot.canScrollPrev
    next.disabled = !snapshot.canScrollNext

    renderDots(snapshot.selectedIndex, snapshot.snapCount)

    const { activeBreakpoint } = derived

    const readings = [
      `${derived.windowWidth}px`,
      String(derived.visibleSlides),
      String(snapshot.snapCount),
      activeBreakpoint ? `maxWidth ${activeBreakpoint.maxWidth}` : 'none'
    ]

    facts.forEach(([, value], index) => setText(value, readings[index]))

    warning.hidden = snapshot.hasOverflow
  }

  const handleResize = (): void => {
    windowWidth = window.innerWidth

    render()
    syncOptions(current.state)
    render()
  }

  const handleKeyDown = (event: KeyboardEvent): void => {
    const { isVertical } = getDerived(current.state)

    if (isPreviousKey(event.key, isVertical)) carousel.scrollPrev()
    if (isNextKey(event.key, isVertical)) carousel.scrollNext()
  }

  previous.addEventListener('click', () => carousel.scrollPrev())
  next.addEventListener('click', () => carousel.scrollNext())
  viewport.addEventListener('keydown', handleKeyDown)
  window.addEventListener('resize', handleResize)

  const stopListening = carousel.subscribe(render)

  render()

  return {
    element: card,
    carousel: {
      scrollNext: () => carousel.scrollNext(),
      scrollPrev: () => carousel.scrollPrev(),
      scrollTo: (index) => carousel.scrollTo(index),
      selectedScrollSnap: () => carousel.getSnapshot().selectedIndex,
      scrollSnapList: () => toRange(carousel.getSnapshot().snapCount),
      canScrollNext: () => carousel.getSnapshot().canScrollNext,
      canScrollPrev: () => carousel.getSnapshot().canScrollPrev
    },
    update: (nextProps) => {
      const hasNewSlides = nextProps.slides.length !== slideNodes.length

      current = nextProps

      if (hasNewSlides) buildSlides(nextProps.slides)

      render()
      syncOptions(nextProps.state)
      render()
    },
    destroy: () => {
      stopListening()
      carousel.destroy()
      window.removeEventListener('resize', handleResize)
    }
  }
}
