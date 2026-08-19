import { describe, expect, it } from 'vitest'
import ts from 'typescript'
import { HtmlParser } from '@angular/compiler'
import { DEFAULT_STATE, buildStyles } from '@swipi/playground-core'
import type { PlaygroundState } from '@swipi/playground-core'
import { buildMarkup } from './helpers'

const build = (
  state: Partial<PlaygroundState>,
  minimal = false,
  tailwind = false
): string => buildMarkup({ ...DEFAULT_STATE, ...state }, minimal, tailwind)

const getSyntaxErrors = (code: string): string[] => {
  const { diagnostics = [] } = ts.transpileModule(code, {
    reportDiagnostics: true,
    compilerOptions: {
      target: ts.ScriptTarget.ESNext,
      experimentalDecorators: true
    }
  })

  return diagnostics.map((diagnostic) =>
    ts.flattenDiagnosticMessageText(diagnostic.messageText, ' ')
  )
}

const TEMPLATE_START = 'template: `'

const getTemplate = (code: string): string => {
  const start = code.indexOf(TEMPLATE_START)
  const end = code.indexOf('`', start + TEMPLATE_START.length)

  if (start < 0 || end < 0) throw new Error('the component has no template')

  return code.slice(start + TEMPLATE_START.length, end)
}

const getTemplateErrors = (code: string): string[] =>
  new HtmlParser()
    .parse(getTemplate(code), 'snippet.html', { tokenizeBlocks: true })
    .errors.map((error) => error.msg)

const VARIANTS: Partial<PlaygroundState>[] = [
  {},
  { showDots: false, showArrows: false },
  { showDots: true, showArrows: true, loop: false },
  { slidesAnimation: 'fade-in' },
  { axis: 'y' },
  { autoplay: true, dragFree: true, startIndex: 2, ariaLabel: 'Галерея' }
]

describe('the generated component', () => {
  it.each(VARIANTS)('parses as a module with %o', (variant) => {
    expect(getSyntaxErrors(build(variant))).toEqual([])
  })

  it.each(VARIANTS)('parses the minimal variant with %o', (variant) => {
    expect(getSyntaxErrors(build(variant, true))).toEqual([])
  })

  it.each(VARIANTS)(
    'leaves the compiler a template it reads with %o',
    (variant) => {
      expect(getTemplateErrors(build(variant))).toEqual([])
    }
  )

  it.each(VARIANTS)('reads the minimal template as well with %o', (variant) => {
    expect(getTemplateErrors(build(variant, true, true))).toEqual([])
  })

  it('imports the hook from the angular adapter', () => {
    expect(build({})).toContain(
      "import { useSwipiCarousel } from '@midstem/swipi-angular'"
    )
  })

  it('hands the viewport to the ref through an effect', () => {
    const code = build({})

    expect(code).toContain(
      "readonly viewport = viewChild<ElementRef<HTMLElement>>('viewport')"
    )
    expect(code).toContain('effect(() => carouselRef(this.viewport()))')
  })

  it('calls the hook without options while every one is a default', () => {
    expect(build({ loop: false })).toContain('useSwipiCarousel()')
  })

  it('passes the axis on once it is no longer the default', () => {
    expect(build({ axis: 'y' })).toContain("axis: 'y'")
    expect(build({ axis: 'x' })).not.toContain('axis:')
  })

  it('labels the carousel with the name from the playground', () => {
    expect(build({ ariaLabel: 'Gallery' })).toContain('aria-label="Gallery"')
  })

  it('announces the selected slide through a live region', () => {
    expect(build({})).toContain(
      '<span class="carousel__status" aria-live="polite" aria-atomic="true">'
    )
  })

  it('leaves the arrow keys wired even without arrows on the page', () => {
    const code = build({ showArrows: false })

    expect(code).toContain('(keydown)="handleKeyDown($event)"')
    expect(code).not.toContain('Previous slide')
  })

  it('wires the arrow keys the vertical axis answers to', () => {
    const code = build({ axis: 'y' })

    expect(code).toContain("event.key === 'ArrowUp'")
    expect(code).toContain("event.key === 'ArrowDown'")
    expect(code).not.toContain('ArrowLeft')
  })

  it('counts the dots off the snapshot only when they are asked for', () => {
    expect(build({ showDots: true })).toContain('readonly dots = computed(')
    expect(build({ showDots: false })).not.toContain('computed')
  })

  it('drops every role and label from the minimal variant', () => {
    const minimal = build({}, true)

    expect(minimal).not.toContain('role=')
    expect(minimal).not.toContain('aria-')
    expect(minimal).not.toContain('handleKeyDown')
  })

  it('marks the selected slide the way the fade-in CSS expects', () => {
    expect(build({ slidesAnimation: 'fade-in' })).toContain(
      '[attr.data-selected]="index === carousel().selectedIndex"'
    )
  })

  it('stacks the track and frees the horizontal gesture on the vertical axis', () => {
    const styles = buildStyles({ ...DEFAULT_STATE, axis: 'y' })

    expect(styles).toContain('flex-direction: column;')
    expect(styles).toContain('touch-action: pan-x;')
    expect(styles).not.toContain('margin-left')
  })
})
