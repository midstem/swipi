import { Component, input, output } from '@angular/core'
import type { PlaygroundEvent } from '@swipi/playground-core'

@Component({
  selector: 'pg-event-log',
  styles: ':host { display: contents; }',
  template: `
    <div class="pg-card">
      <div class="pg-card__header">
        <h2 class="pg-card__title">Events</h2>
        <button
          type="button"
          class="pg-button pg-button--ghost"
          (click)="cleared.emit()"
        >
          Clear
        </button>
      </div>
      <ul class="pg-events">
        @for (event of events(); track event.id) {
          <li>
            <span class="pg-events__name">{{ event.name }}</span>
            <code>{{ event.payload }}</code>
          </li>
        } @empty {
          <li class="pg-hint">No events yet</li>
        }
      </ul>
    </div>
  `
})
export class EventLog {
  readonly events = input.required<PlaygroundEvent[]>()

  readonly cleared = output<void>()
}
