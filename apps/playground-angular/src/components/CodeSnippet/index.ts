import { Component, computed, input, signal } from '@angular/core'
import { STYLES, buildStyles } from '@swipi/playground-core'
import type { PlaygroundState } from '@swipi/playground-core'
import { buildMarkup } from './helpers'
import { CodeBlock } from '../CodeBlock'

const COPIED_TIMEOUT = 1500

const VARIANTS = [
  { minimal: false, title: 'Accessible' },
  { minimal: true, title: 'Minimal' }
]

const FLAVOURS = [
  { tailwind: true, title: 'Tailwind' },
  { tailwind: false, title: 'CSS' }
]

@Component({
  selector: 'pg-code-snippet',
  imports: [CodeBlock],
  styles: ':host { display: contents; }',
  template: `
    <section [class]="STYLES.card">
      <header [class]="STYLES.cardHeader">
        <h2 [class]="STYLES.cardTitle">Generated code</h2>
        <div [class]="STYLES.row">
          <div [class]="STYLES.toolbarGroup">
            <span [class]="STYLES.toolbarLabel">Markup</span>
            <div [class]="STYLES.segmented">
              @for (variant of variants; track variant.title) {
                <button
                  type="button"
                  [class]="
                    variant.minimal === minimal()
                      ? STYLES.segmentActive
                      : STYLES.segment
                  "
                  [attr.aria-pressed]="variant.minimal === minimal()"
                  (click)="minimal.set(variant.minimal)"
                >
                  {{ variant.title }}
                </button>
              }
            </div>
          </div>

          <div [class]="STYLES.toolbarGroup">
            <span [class]="STYLES.toolbarLabel">Styles</span>
            <div [class]="STYLES.segmented">
              @for (flavour of flavours; track flavour.title) {
                <button
                  type="button"
                  [class]="
                    flavour.tailwind === tailwind()
                      ? STYLES.segmentActive
                      : STYLES.segment
                  "
                  [attr.aria-pressed]="flavour.tailwind === tailwind()"
                  (click)="tailwind.set(flavour.tailwind)"
                >
                  {{ flavour.title }}
                </button>
              }
            </div>
          </div>

          <span [class]="STYLES.toolbarDivider"></span>

          <button type="button" [class]="STYLES.button" (click)="copy()">
            {{ copied() ? 'Copied' : 'Copy' }}
          </button>
        </div>
      </header>

      <p [class]="STYLES.hint">
        @if (minimal()) {
          The same carousel with everything optional taken off: no roles, no
          labels, no live region, no arrow keys — the layout as
          {{ flavour() }}. Shortest thing that works; reach for the accessible
          variant before you ship.
        } @else {
          Everything the current settings need: the hook options, the accessible
          markup around them, the rest as {{ flavour() }}. The roles, labels and
          the live region are yours to edit and translate once you paste this.
        }
      </p>

      <pg-code-block [code]="markup()" language="typescript" />
      @if (styles()) {
        <pg-code-block [code]="styles()" language="css" />
      }
    </section>
  `
})
export class CodeSnippet {
  protected readonly STYLES = STYLES

  readonly state = input.required<PlaygroundState>()

  readonly variants = VARIANTS

  readonly flavours = FLAVOURS

  readonly copied = signal(false)

  readonly minimal = signal(true)

  readonly tailwind = signal(true)

  readonly flavour = computed(() =>
    this.tailwind() ? 'Tailwind classes' : 'CSS'
  )

  readonly markup = computed(() =>
    buildMarkup(this.state(), this.minimal(), this.tailwind())
  )

  readonly styles = computed(() =>
    this.tailwind() ? '' : buildStyles(this.state(), this.minimal())
  )

  copy(): void {
    const styles = this.styles()
    const markup = this.markup()

    void navigator.clipboard.writeText(
      styles ? `${markup}\n\n/* CSS */\n${styles}` : markup
    )

    this.copied.set(true)

    setTimeout(() => this.copied.set(false), COPIED_TIMEOUT)
  }
}
