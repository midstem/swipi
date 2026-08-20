import type { JSX } from 'react'
import { STYLES, EventLogProps } from '@swipi/playground-core'

const EventLog = ({ events, onClear }: EventLogProps): JSX.Element => (
  <div className={STYLES.card}>
    <div className={STYLES.cardHeader}>
      <h2 className={STYLES.cardTitle}>Events</h2>
      <button type="button" className={STYLES.ghostButton} onClick={onClear}>
        Clear
      </button>
    </div>
    <ul className={STYLES.events}>
      {events.map((event) => (
        <li key={event.id} className={STYLES.event}>
          <span className={STYLES.eventName}>{event.name}</span>
          <code>{event.payload}</code>
        </li>
      ))}
      {!events.length && <li className={STYLES.hint}>No events yet</li>}
    </ul>
  </div>
)

export default EventLog
