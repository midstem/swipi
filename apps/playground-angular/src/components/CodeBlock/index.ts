import { Component, computed, input } from '@angular/core'
import { CODE_TOKEN_STYLES, STYLES, highlight } from '@swipi/playground-core'
import type { CodeLanguage, CodeTokenKind } from '@swipi/playground-core'

@Component({
  selector: 'pg-code-block',
  styles: ':host { display: contents; }',
  template: `<pre
    [class]="STYLES.code"
  >@for (token of tokens(); track $index) {<span [class]="styleOf(token.kind)">{{ token.text }}</span>}</pre>`
})
export class CodeBlock {
  protected readonly STYLES = STYLES

  readonly code = input.required<string>()

  readonly language = input.required<CodeLanguage>()

  readonly tokens = computed(() => highlight(this.code(), this.language()))

  styleOf(kind: CodeTokenKind): string {
    return CODE_TOKEN_STYLES[kind]
  }
}
