import {
  ARROWS,
  KEYS,
  getClassNames,
  getOptions,
  isFadeInAnimation
} from '@swipi/playground-core'
import type { ClassNames, PlaygroundState } from '@swipi/playground-core'

const SLIDES = ['one', 'two', 'three']

const FIRST_SLIDE_OFFSET = 1

const buildSlide = (
  title: string,
  index: number,
  classes: ClassNames,
  minimal: boolean
): string => {
  if (minimal) return `    <div class="${classes.slide}">${title}</div>`

  return `    <div
      class="${classes.slide}"
      role="group"
      aria-roledescription="slide"
      aria-label="${index + FIRST_SLIDE_OFFSET} of ${SLIDES.length}"
    >
      ${title}
    </div>`
}

const buildArrows = (state: PlaygroundState, minimal: boolean): string => {
  if (!state.showArrows) return ''

  const [previous, next] = ARROWS[state.axis]

  const label = (text: string): string =>
    minimal ? '' : ` aria-label="${text}"`

  return `

<button type="button" id="prev"${label('Previous slide')}>${previous}</button>
<button type="button" id="next"${label('Next slide')}>${next}</button>`
}

const buildDots = (state: PlaygroundState): string =>
  state.showDots ? '\n\n<nav id="dots"></nav>' : ''

export const buildMarkup = (
  state: PlaygroundState,
  minimal = false,
  tailwind = false
): string => {
  const classes = getClassNames(state, tailwind)

  const slides = SLIDES.map((title, index) =>
    buildSlide(title, index, classes, minimal)
  ).join('\n')

  const viewport = minimal
    ? `<div id="carousel" class="${classes.viewport}">`
    : `<div
  id="carousel"
  class="${classes.viewport}"
  role="group"
  tabindex="0"
  aria-roledescription="carousel"
  aria-label="${state.ariaLabel}"
>`

  const status = minimal
    ? ''
    : `

<span
  id="status"
  class="${classes.status}"
  aria-live="polite"
  aria-atomic="true"
></span>`

  return `${viewport}
  <div class="${classes.track}">
${slides}
  </div>
</div>${status}${buildArrows(state, minimal)}${buildDots(state)}`
}

const buildQueries = (state: PlaygroundState, minimal: boolean): string => {
  const queries = ["const viewport = document.querySelector('#carousel')"]

  if (!minimal) queries.push("const status = document.querySelector('#status')")

  if (state.showArrows) {
    queries.push(
      "const prev = document.querySelector('#prev')",
      "const next = document.querySelector('#next')"
    )
  }

  if (state.showDots) {
    queries.push("const dots = document.querySelector('#dots')")
  }

  if (isFadeInAnimation(state.slidesAnimation)) {
    queries.push(
      'const slides = Array.from(viewport.firstElementChild.children)'
    )
  }

  return queries.join('\n')
}

const buildEngine = (state: PlaygroundState): string => {
  const options = getOptions(state)

  return `const carousel = createSwipi(viewport${options ? `, ${options}` : ''})`
}

const buildControls = (state: PlaygroundState, minimal: boolean): string => {
  const blocks: string[] = []

  if (state.showArrows) {
    blocks.push(`prev.addEventListener('click', () => carousel.scrollPrev())
next.addEventListener('click', () => carousel.scrollNext())`)
  }

  if (!minimal) {
    const [previousKey, nextKey] = KEYS[state.axis]

    blocks.push(`viewport.addEventListener('keydown', (event) => {
  if (event.key === '${previousKey}') carousel.scrollPrev()
  if (event.key === '${nextKey}') carousel.scrollNext()
})`)
  }

  return blocks.length ? `\n\n${blocks.join('\n\n')}` : ''
}

const buildDotsRenderer = (
  state: PlaygroundState,
  minimal: boolean
): string => {
  if (!state.showDots) return ''

  const label = minimal
    ? ''
    : `
      dot.setAttribute('aria-label', \`Go to slide \${index + 1}\`)`

  const marker = minimal
    ? 'dot.dataset.active = String(index === snapshot.selectedIndex)'
    : "dot.setAttribute('aria-current', String(index === snapshot.selectedIndex))"

  return `

const renderDots = (snapshot) => {
  if (dots.children.length !== snapshot.snapCount) {
    dots.replaceChildren(
      ...Array.from({ length: snapshot.snapCount }, (_, index) => {
        const dot = document.createElement('button')

        dot.type = 'button'
        dot.className = 'carousel__dot'${label}
        dot.addEventListener('click', () => carousel.scrollTo(index))

        return dot
      })
    )
  }

  Array.from(dots.children).forEach((dot, index) => {
    ${marker}
  })
}`
}

const buildRenderBody = (
  state: PlaygroundState,
  minimal: boolean
): string[] => {
  const lines: string[] = []

  if (state.showArrows) {
    lines.push(
      `  prev.disabled = !snapshot.canScrollPrev
  next.disabled = !snapshot.canScrollNext`
    )
  }

  if (!minimal) {
    lines.push(
      '  status.textContent = `Slide ${snapshot.selectedIndex + 1} of ${snapshot.snapCount}`'
    )
  }

  if (isFadeInAnimation(state.slidesAnimation)) {
    lines.push(`  slides.forEach((slide, index) => {
    slide.dataset.selected = String(index === snapshot.selectedIndex)
  })`)
  }

  if (state.showDots) lines.push('  renderDots(snapshot)')

  return lines
}

export const buildScript = (
  state: PlaygroundState,
  minimal = false
): string => {
  const head = `import { createSwipi } from '@midstem/swipi'

${buildQueries(state, minimal)}

${buildEngine(state)}${buildControls(state, minimal)}`

  const body = buildRenderBody(state, minimal)

  if (!body.length) return head

  return `${head}${buildDotsRenderer(state, minimal)}

const render = () => {
  const snapshot = carousel.getSnapshot()

${body.join('\n')}
}

carousel.subscribe(render)

render()`
}
