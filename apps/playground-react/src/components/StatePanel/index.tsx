import type { JSX } from 'react'
import { JSON_INDENT } from '@swipi/playground-core'
import { StatePanelProps } from '@swipi/playground-core'

const StatePanel = ({
  swipiState,
  positions
}: StatePanelProps): JSX.Element => (
  <div className="pg-card pg-card--split">
    <div>
      <h2 className="pg-card__title">onSelect state</h2>
      <pre className="pg-code">
        {JSON.stringify(swipiState, null, JSON_INDENT)}
      </pre>
    </div>
    <div>
      <h2 className="pg-card__title">onChange positions</h2>
      <pre className="pg-code">
        {JSON.stringify(positions, null, JSON_INDENT)}
      </pre>
    </div>
  </div>
)

export default StatePanel
