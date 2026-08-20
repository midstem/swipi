import type { JSX } from 'react'
import { STYLES, JSON_INDENT } from '@swipi/playground-core'
import { StatePanelProps } from '@swipi/playground-core'

const StatePanel = ({
  swipiState,
  positions
}: StatePanelProps): JSX.Element => (
  <div className={STYLES.cardSplit}>
    <div>
      <h2 className={STYLES.cardTitle}>onSelect state</h2>
      <pre className={STYLES.code}>
        {JSON.stringify(swipiState, null, JSON_INDENT)}
      </pre>
    </div>
    <div>
      <h2 className={STYLES.cardTitle}>onChange positions</h2>
      <pre className={STYLES.code}>
        {JSON.stringify(positions, null, JSON_INDENT)}
      </pre>
    </div>
  </div>
)

export default StatePanel
