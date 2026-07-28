import type { JSX } from 'react'
import CodeSnippet from './components/CodeSnippet'
import ControlsPanel from './components/ControlsPanel'
import EventLog from './components/EventLog'
import ImperativeApi from './components/ImperativeApi'
import Stage from './components/Stage'
import StatePanel from './components/StatePanel'
import { usePlayground } from './usePlayground'
import './playground.css'

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
          <h1 className="pg-header__title">Swipi playground</h1>
          <p className="pg-hint">
            Every prop of the component is editable here — the settings are kept
            in <code>localStorage</code> between reloads.
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
            state={state}
            slides={slides}
            swipiRef={swipiRef}
            remountKey={remountKey}
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
