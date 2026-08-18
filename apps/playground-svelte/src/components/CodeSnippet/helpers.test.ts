import { describe, expect, it } from 'vitest'
import { compile } from 'svelte/compiler'
import { buildStyles } from '@swipi/playground-core'
import { DEFAULT_STATE } from '@swipi/playground-core'
import { PlaygroundState } from '@swipi/playground-core'
import { buildMarkup } from './helpers'

const build = (
  state: Partial<PlaygroundState>,
  minimal = false,
  tailwind = false
): string => buildMarkup({ ...DEFAULT_STATE, ...state }, minimal, tailwind)

const getSyntaxErrors = (code: string): string[] => {
  try {
    compile(code, { filename: 'Carousel.svelte', generate: 'client' })

    return []
  } catch (error) {
    return [(error as Error).message]
  }
}

const VARIANTS: Partial<PlaygroundState>[] = [
  {},
  { showDots: false, showArrows: false },
  { showDots: true, showArrows: true, loop: false },
  { slidesAnimation: 'fade-in' },
  { axis: 'y' },
  { autoplay: true, dragFree: true, startIndex: 2, ariaLabel: 'Галерея' }
]

describe('the generated markup', () => {
  it.each(VARIANTS)('compiles as a svelte component with %o', (variant) => {
    expect(getSyntaxErrors(build(variant))).toEqual([])
  })

  it.each(VARIANTS)('compiles the minimal variant with %o', (variant) => {
    expect(getSyntaxErrors(build(variant, true))).toEqual([])
  })

  it.each(VARIANTS)('compiles the tailwind variant with %o', (variant) => {
    expect(getSyntaxErrors(build(variant, false, true))).toEqual([])
  })

  it('imports the composable from the svelte adapter', () => {
    expect(build({})).toContain(
      "import { useSwipiCarousel } from '@midstem/swipi-svelte'"
    )
  })

  it('drives the viewport with the action, never with a ref', () => {
    const markup = build({})

    expect(markup).toContain('use:carouselRef')
    expect(markup).not.toContain('ref=')
  })

  it('reads the carousel through the store prefix', () => {
    expect(build({})).toContain('$carousel.selectedIndex')
  })

  it('labels the carousel with the name from the playground', () => {
    expect(build({ ariaLabel: 'Gallery' })).toContain('aria-label="Gallery"')
  })

  it('leaves the arrow keys wired even without arrows on the page', () => {
    const markup = build({ showArrows: false })

    expect(markup).toContain('onkeydown={handleKeyDown}')
    expect(markup).not.toContain('Previous slide')
  })

  it('announces the selected slide through a live region', () => {
    expect(build({})).toContain(
      '<span class="carousel__status" aria-live="polite" aria-atomic="true">'
    )
  })

  it('wires the arrow keys the vertical axis answers to', () => {
    const markup = build({ axis: 'y' })

    expect(markup).toContain("event.key === 'ArrowUp'")
    expect(markup).toContain("event.key === 'ArrowDown'")
    expect(markup).not.toContain('ArrowLeft')
  })

  it('passes the axis on once it is no longer the default', () => {
    expect(build({ axis: 'y' })).toContain("axis: 'y'")
    expect(build({ axis: 'x' })).not.toContain('axis:')
  })

  it('counts the dots off the snap count it is given', () => {
    expect(build({ showDots: true })).toContain('$carousel.snapCount')
    expect(build({ showDots: false })).not.toContain('dots as index')
  })

  it('stacks the track and frees the horizontal gesture on the vertical axis', () => {
    const styles = buildStyles({ ...DEFAULT_STATE, axis: 'y' })

    expect(styles).toContain('flex-direction: column;')
    expect(styles).toContain('touch-action: pan-x;')
    expect(styles).toContain(`height: ${DEFAULT_STATE.stageHeight}px;`)
    expect(styles).toContain('margin-top: -')
    expect(styles).toContain('padding-top: ')
    expect(styles).not.toContain('margin-left')
  })

  it('marks the selected slide the way the fade-in CSS expects', () => {
    const state: Partial<PlaygroundState> = { slidesAnimation: 'fade-in' }

    expect(build(state)).toContain(
      'data-selected={index === $carousel.selectedIndex}'
    )
    expect(buildStyles({ ...DEFAULT_STATE, ...state })).toContain(
      "[data-selected='true']"
    )
  })
})
