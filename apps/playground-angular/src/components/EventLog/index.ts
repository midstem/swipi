import { Component, input, output } from '@angular/core'
import type { PlaygroundEvent } from '@swipi/playground-core'
import { STYLES } from '@swipi/playground-core'

@Component({
  selector: 'pg-event-log',
  styles: ':host { display: contents; }',
  template: `
    <div [class]="STYLES.card">
      <div [class]="STYLES.cardHeader">
        <h2 [class]="STYLES.cardTitle">Events</h2>
        <button
          type="button"
          [class]="STYLES.ghostButton"
          (click)="cleared.emit()"
        >
          Clear
        </button>
      </div>
      <ul [class]="STYLES.events">
        @for (event of events(); track event.id) {
          <li [class]="STYLES.event">
            <span [class]="STYLES.eventName">{{ event.name }}</span>
            <code>{{ event.payload }}</code>
          </li>
        } @empty {
          <li [class]="STYLES.hint">No events yet</li>
        }
      </ul>
    </div>
  `
})
export class EventLog {
  protected readonly STYLES = STYLES

  readonly events = input.required<PlaygroundEvent[]>()

  readonly cleared = output<void>()
}
