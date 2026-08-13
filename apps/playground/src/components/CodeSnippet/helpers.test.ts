import { describe, expect, it } from 'vitest'
import ts from 'typescript'
import { buildMarkup, buildStyles } from './helpers'
import { DEFAULT_STATE } from '../../constants'
import { PlaygroundState } from '../../types'

const build = (state: Partial<PlaygroundState>): string =>
  buildMarkup({ ...DEFAULT_STATE, ...state })

const getSyntaxErrors = (code: string): string[] => {
  const { diagnostics = [] } = ts.transpileModule(code, {
    reportDiagnostics: true,
    compilerOptions: {
      jsx: ts.JsxEmit.Preserve,
      target: ts.ScriptTarget.ESNext
    }
  })

  return diagnostics.map((diagnostic) =>
    ts.flattenDiagnosticMessageText(diagnostic.messageText, ' ')
  )
}

const VARIANTS: Partial<PlaygroundState>[] = [
  {},
  { showDots: false, showArrows: false },
  { showDots: true, showArrows: true, loop: false },
  { slidesAnimation: 'fade-in' },
  { autoplay: true, dragFree: true, startIndex: 2, ariaLabel: 'Галерея' }
]

describe('the generated markup', () => {
  it.each(VARIANTS)('parses as TSX with %o', (variant) => {
    expect(getSyntaxErrors(build(variant))).toEqual([])
  })

  it('labels the carousel with the name from the playground', () => {
    expect(build({ ariaLabel: 'Gallery' })).toContain('aria-label="Gallery"')
  })

  it('leaves the arrow keys wired even without arrows on the page', () => {
    const markup = build({ showArrows: false })

    expect(markup).toContain('onKeyDown={handleKeyDown}')
    expect(markup).not.toContain('Previous slide')
  })

  it('announces the selected slide through a live region', () => {
    expect(build({})).toContain(
      '<span className="carousel__status" aria-live="polite" aria-atomic="true">'
    )
  })

  it('marks the selected slide the way the fade-in CSS expects', () => {
    const state: Partial<PlaygroundState> = { slidesAnimation: 'fade-in' }

    expect(build(state)).toContain(
      'data-selected={index === carousel.selectedIndex}'
    )
    expect(buildStyles({ ...DEFAULT_STATE, ...state })).toContain(
      "[data-selected='true']"
    )
  })
})
