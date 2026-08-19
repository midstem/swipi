import { Component } from '@angular/core'
import { CodeSnippet } from './components/CodeSnippet'
import { ControlsPanel } from './components/ControlsPanel'
import { EventLog } from './components/EventLog'
import { ImperativeApi } from './components/ImperativeApi'
import { Stage } from './components/Stage'
import { StatePanel } from './components/StatePanel'
import { usePlayground } from './usePlayground'

@Component({
  selector: 'pg-root',
  imports: [
    CodeSnippet,
    ControlsPanel,
    EventLog,
    ImperativeApi,
    Stage,
    StatePanel
  ],
  template: `
    <div class="pg">
      <header class="pg-header">
        <div>
          <h1
            class="pg-header__title"
            style="display: flex; align-items: center; gap: 8px"
          >
            <svg class="logo" viewBox="0 0 250 250" width="24" height="24">
              <path
                fill="#dd0031"
                d="M125 30L31.9 63.2l14.2 123.1L125 230l78.9-43.7 14.2-123.1z"
              />
              <path
                fill="#c3002f"
                d="M125 30v22.2-.1V230l78.9-43.7 14.2-123.1z"
              />
              <path
                fill="#fff"
                d="M125 52.1L66.8 182.6h21.7l11.7-29.2h49.4l11.7 29.2H183zm17 83.3h-34l17-40.9z"
              />
            </svg>
            Swipi playground
          </h1>
          <p class="pg-hint">
            Every option of the hook is editable here, next to the layout the
            playground draws around it — the settings are kept in
            <code>localStorage</code> between reloads.
          </p>
        </div>
        <div class="pg-header__actions">
          <button type="button" class="pg-button" (click)="remount()">
            Remount
          </button>
          <button type="button" class="pg-button" (click)="reset()">
            Reset props
          </button>
        </div>
      </header>

      <div class="pg-layout">
        <pg-controls-panel [state]="state()" [update]="update" />

        <main class="pg-stage">
          @for (key of [remountKey()]; track key) {
            <pg-stage
              [state]="state()"
              [slides]="slides()"
              (selected)="handleSelect($event)"
              (changed)="handleChange($event)"
              (ready)="handleReady($event)"
            />
          }
          <pg-imperative-api
            [carousel]="carousel()"
            [slidesCount]="state().slidesCount"
          />
          <pg-state-panel
            [swipiState]="swipiState()"
            [positions]="positions()"
          />
          <pg-event-log [events]="events()" (cleared)="clearEvents()" />
          <pg-code-snippet [state]="state()" />
        </main>
      </div>
    </div>
  `
})
export class App {
  private readonly playground = usePlayground()

  readonly state = this.playground.state

  readonly slides = this.playground.slides

  readonly events = this.playground.events

  readonly carousel = this.playground.carousel

  readonly swipiState = this.playground.swipiState

  readonly positions = this.playground.positions

  readonly remountKey = this.playground.remountKey

  readonly update = this.playground.update

  readonly remount = this.playground.remount

  readonly reset = this.playground.reset

  readonly clearEvents = this.playground.clearEvents

  readonly handleSelect = this.playground.handleSelect

  readonly handleChange = this.playground.handleChange

  readonly handleReady = this.playground.handleReady
}
