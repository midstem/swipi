import type { JSX } from 'react'
import CodeSnippet from './components/CodeSnippet'
import ControlsPanel from './components/ControlsPanel'
import EventLog from './components/EventLog'
import ImperativeApi from './components/ImperativeApi'
import Stage from './components/Stage'
import StatePanel from './components/StatePanel'
import { usePlayground } from './usePlayground'
import '@swipi/playground-core/playground.css'

const Playground = (): JSX.Element => {
  const {
    state,
    slides,
    events,
    swipiRef,
    swipiState,
    positions,
    remountKey,
    update,
    remount,
    reset,
    clearEvents,
    handleSelect,
    handleChange
  } = usePlayground()

  return (
    <div className="pg">
      <header className="pg-header">
        <div>
          <h1
            className="pg-header__title"
            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <svg
              viewBox="0 0 118 103"
              width="24"
              height="24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g fill="none" fillRule="evenodd">
                <circle cx="59" cy="51.5" r="10.8" fill="#61DAFB" />
                <ellipse
                  cx="59"
                  cy="51.5"
                  rx="59"
                  ry="22.9"
                  stroke="#61DAFB"
                  strokeWidth="4.5"
                />
                <ellipse
                  cx="59"
                  cy="51.5"
                  rx="59"
                  ry="22.9"
                  stroke="#61DAFB"
                  strokeWidth="4.5"
                  transform="rotate(60 59 51.5)"
                />
                <ellipse
                  cx="59"
                  cy="51.5"
                  rx="59"
                  ry="22.9"
                  stroke="#61DAFB"
                  strokeWidth="4.5"
                  transform="rotate(120 59 51.5)"
                />
              </g>
            </svg>
            Swipi playground
          </h1>
          <p className="pg-hint">
            Every option of the hook is editable here, next to the layout the
            playground draws around it — the settings are kept in{' '}
            <code>localStorage</code> between reloads.
          </p>
        </div>
        <div className="pg-header__actions">
          <button type="button" className="pg-button" onClick={remount}>
            Remount
          </button>
          <button type="button" className="pg-button" onClick={reset}>
            Reset props
          </button>
        </div>
      </header>

      <div className="pg-layout">
        <ControlsPanel state={state} update={update} />

        <main className="pg-stage">
          <Stage
            key={remountKey}
            state={state}
            slides={slides}
            swipiRef={swipiRef}
            onSelect={handleSelect}
            onChange={handleChange}
          />
          <ImperativeApi swipiRef={swipiRef} slidesCount={state.slidesCount} />
          <StatePanel swipiState={swipiState} positions={positions} />
          <EventLog events={events} onClear={clearEvents} />
          <CodeSnippet state={state} />
        </main>
      </div>
    </div>
  )
}

export default Playground
