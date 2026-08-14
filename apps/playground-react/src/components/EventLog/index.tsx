import type { JSX } from 'react'
import { EventLogProps } from '@swipi/playground-core'

const EventLog = ({ events, onClear }: EventLogProps): JSX.Element => (
  <div className="pg-card">
    <div className="pg-card__header">
      <h2 className="pg-card__title">Events</h2>
      <button
        type="button"
        className="pg-button pg-button--ghost"
        onClick={onClear}
      >
        Clear
      </button>
    </div>
    <ul className="pg-events">
      {events.map((event) => (
        <li key={event.id}>
          <span className="pg-events__name">{event.name}</span>
          <code>{event.payload}</code>
        </li>
      ))}
      {!events.length && <li className="pg-hint">No events yet</li>}
    </ul>
  </div>
)

export default EventLog
