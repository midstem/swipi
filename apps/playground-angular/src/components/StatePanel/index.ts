import { Component, computed, input } from '@angular/core'
import { STYLES, JSON_INDENT } from '@swipi/playground-core'
import type { SlidePositions, SwipiState } from '@midstem/swipi-angular'

@Component({
  selector: 'pg-state-panel',
  styles: ':host { display: contents; }',
  template: `
    <div [class]="STYLES.cardSplit">
      <div>
        <h2 [class]="STYLES.cardTitle">onSelect state</h2>
        <pre [class]="STYLES.code">{{ swipiStateStr() }}</pre>
      </div>
      <div>
        <h2 [class]="STYLES.cardTitle">onChange positions</h2>
        <pre [class]="STYLES.code">{{ positionsStr() }}</pre>
      </div>
    </div>
  `
})
export class StatePanel {
  protected readonly STYLES = STYLES

  readonly swipiState = input<SwipiState>()

  readonly positions = input<SlidePositions>()

  readonly swipiStateStr = computed(() =>
    JSON.stringify(this.swipiState(), null, JSON_INDENT)
  )

  readonly positionsStr = computed(() =>
    JSON.stringify(this.positions(), null, JSON_INDENT)
  )
}
