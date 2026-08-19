import { describe, expect, it } from 'vitest'
import ts from 'typescript'
import { DEFAULT_STATE, buildStyles } from '@swipi/playground-core'
import type { PlaygroundState } from '@swipi/playground-core'
import { buildMarkup, buildScript } from './helpers'

const markup = (
  state: Partial<PlaygroundState>,
  minimal = false,
  tailwind = false
): string => buildMarkup({ ...DEFAULT_STATE, ...state }, minimal, tailwind)

const script = (state: Partial<PlaygroundState>, minimal = false): string =>
  buildScript({ ...DEFAULT_STATE, ...state }, minimal)

const getSyntaxErrors = (code: string): string[] => {
  const { diagnostics = [] } = ts.transpileModule(code, {
    reportDiagnostics: true,
    compilerOptions: { target: ts.ScriptTarget.ESNext }
  })

  return diagnostics.map((diagnostic) =>
    ts.flattenDiagnosticMessageText(diagnostic.messageText, ' ')
  )
}

const parse = (html: string): Document =>
  new DOMParser().parseFromString(html, 'text/html')

const getViewport = (html: string): HTMLElement => {
  const viewport = parse(html).querySelector<HTMLElement>('#carousel')

  if (!viewport) throw new Error('the markup has no viewport')

  return viewport
}

const VARIANTS: Partial<PlaygroundState>[] = [
  {},
  { showDots: false, showArrows: false },
  { showDots: true, showArrows: true, loop: false },
  { slidesAnimation: 'fade-in' },
  { axis: 'y' },
  { autoplay: true, dragFree: true, startIndex: 2, ariaLabel: 'Галерея' }
]

describe('the generated script', () => {
  it.each(VARIANTS)('parses as a module with %o', (variant) => {
    expect(getSyntaxErrors(script(variant))).toEqual([])
  })

  it.each(VARIANTS)('parses the minimal variant with %o', (variant) => {
    expect(getSyntaxErrors(script(variant, true))).toEqual([])
  })

  it('imports the engine from the package it publishes', () => {
    expect(script({})).toContain("import { createSwipi } from '@midstem/swipi'")
  })

  it('reads the state through the snapshot, never through the engine', () => {
    const code = script({})

    expect(code).toContain('const snapshot = carousel.getSnapshot()')
    expect(code).toContain('carousel.subscribe(render)')
  })

  it('passes the axis on once it is no longer the default', () => {
    expect(script({ axis: 'y' })).toContain("axis: 'y'")
    expect(script({ axis: 'x' })).not.toContain('axis:')
  })

  it('calls the engine without options while every one is a default', () => {
    expect(script({ loop: false })).toContain('createSwipi(viewport)')
  })

  it('wires the arrow keys the vertical axis answers to', () => {
    const code = script({ axis: 'y' })

    expect(code).toContain("event.key === 'ArrowUp'")
    expect(code).toContain("event.key === 'ArrowDown'")
    expect(code).not.toContain('ArrowLeft')
  })

  it('leaves the arrow keys wired even without arrows on the page', () => {
    const code = script({ showArrows: false })

    expect(code).toContain("viewport.addEventListener('keydown'")
    expect(code).not.toContain("querySelector('#prev')")
  })

  it('drops the live region and the keyboard from the minimal variant', () => {
    const code = script({}, true)

    expect(code).not.toContain('#status')
    expect(code).not.toContain('keydown')
  })

  it('marks the selected slide the way the fade-in CSS expects', () => {
    expect(script({ slidesAnimation: 'fade-in' })).toContain(
      'slide.dataset.selected = String(index === snapshot.selectedIndex)'
    )
  })

  it('reads the slides off the track, whatever the classes are', () => {
    expect(script({ slidesAnimation: 'fade-in' })).toContain(
      'Array.from(viewport.firstElementChild.children)'
    )
  })
})

describe('the generated markup', () => {
  it.each(VARIANTS)(
    'leaves the track alone inside the viewport with %o',
    (variant) => {
      const viewport = getViewport(markup(variant))

      expect(viewport.children).toHaveLength(1)
      expect(viewport.firstElementChild?.children).toHaveLength(3)
    }
  )

  it.each(VARIANTS)(
    'keeps that shape with tailwind classes and %o',
    (variant) => {
      const viewport = getViewport(markup(variant, false, true))

      expect(viewport.children).toHaveLength(1)
      expect(viewport.firstElementChild?.children).toHaveLength(3)
    }
  )

  it('labels the carousel with the name from the playground', () => {
    expect(markup({ ariaLabel: 'Gallery' })).toContain('aria-label="Gallery"')
  })

  it('announces the selected slide through a live region', () => {
    const status = parse(markup({})).querySelector('#status')

    expect(status?.getAttribute('aria-live')).toBe('polite')
  })

  it('drops every role and label from the minimal variant', () => {
    const minimal = markup({}, true)

    expect(minimal).not.toContain('role=')
    expect(minimal).not.toContain('aria-')
  })

  it('gives the dots a place to render into only when they are asked for', () => {
    expect(markup({ showDots: true })).toContain('<nav id="dots"></nav>')
    expect(markup({ showDots: false })).not.toContain('id="dots"')
  })

  it('stacks the track and frees the horizontal gesture on the vertical axis', () => {
    const styles = buildStyles({ ...DEFAULT_STATE, axis: 'y' })

    expect(styles).toContain('flex-direction: column;')
    expect(styles).toContain('touch-action: pan-x;')
    expect(styles).not.toContain('margin-left')
  })
})
