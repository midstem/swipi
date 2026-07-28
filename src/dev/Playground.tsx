import type { JSX } from 'react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Swipi, { SwipiRef, SwipiState } from '../index'
import { SlidePositions } from '../Swipi/types'
import ConfigEditor from './ConfigEditor'
import {
  ColorField,
  NumberField,
  Section,
  SelectField,
  TextField,
  Toggle
} from './Controls'
import {
  CUSTOM_ACTIVE_DOT,
  CUSTOM_DOT,
  DEFAULT_STATE,
  DOTS_ANIMATION_OPTIONS,
  MAX_EVENTS,
  MAX_SLIDES_COUNT,
  MIN_SLIDES_COUNT,
  SLIDES_ANIMATION_OPTIONS,
  SLIDE_COLORS,
  STAGE_PRESETS
} from './constants'
import { buildCodeSnippet, loadState, saveState } from './helpers'
import {
  ImperativeReadings,
  PlaygroundEvent,
  PlaygroundState,
  UpdateState
} from './types'
import './playground.css'

const Playground = (): JSX.Element => {
  const [state, setState] = useState<PlaygroundState>(loadState)
  const [swipiState, setSwipiState] = useState<SwipiState>()
  const [positions, setPositions] = useState<SlidePositions>()
  const [readings, setReadings] = useState<ImperativeReadings>()
  const [events, setEvents] = useState<PlaygroundEvent[]>([])
  const [windowWidth, setWindowWidth] = useState<number>(window.innerWidth)
  const [scrollToIndex, setScrollToIndex] = useState<number>(0)
  const [remountToken, setRemountToken] = useState<number>(0)
  const [isCopied, setIsCopied] = useState<boolean>(false)

  const swipiRef = useRef<SwipiRef>(null)
  const eventId = useRef<number>(0)

  const update: UpdateState = (key, value) =>
    setState((previous) => ({ ...previous, [key]: value }))

  const pushEvent = useCallback(
    (name: PlaygroundEvent['name'], payload: object): void => {
      eventId.current += 1

      const event: PlaygroundEvent = {
        id: eventId.current,
        name,
        payload: JSON.stringify(payload)
      }

      setEvents((previous) => [event, ...previous].slice(0, MAX_EVENTS))
    },
    []
  )

  const handleSelect = useCallback(
    (next: SwipiState): void => {
      setSwipiState(next)
      pushEvent('onSelect', next)
    },
    [pushEvent]
  )

  const handleChange = useCallback(
    (next: SlidePositions): void => {
      setPositions(next)
      pushEvent('onChange', next)
    },
    [pushEvent]
  )

  useEffect(() => saveState(state), [state])

  useEffect(() => {
    const onResize = (): void => setWindowWidth(window.innerWidth)

    window.addEventListener('resize', onResize)

    return () => window.removeEventListener('resize', onResize)
  }, [])

  const slides = useMemo(
    () => SLIDE_COLORS.slice(0, state.slidesCount),
    [state.slidesCount]
  )

  const activeBreakpoint = useMemo(
    () =>
      state.useConfig
        ? state.config.filter((item) => item.maxWidth >= windowWidth).at(-1)
        : undefined,
    [state.useConfig, state.config, windowWidth]
  )

  const visibleSlides =
    state.slidesAnimation === 'fade-in'
      ? 1
      : (activeBreakpoint?.slidesNumber ?? 0) || state.slidesNumber

  const areArrowsAvailable = state.slidesCount > visibleSlides

  const code = useMemo(() => buildCodeSnippet(state), [state])

  const readRefState = (): void => {
    const swipi = swipiRef.current

    if (!swipi) return

    setReadings({
      selectedScrollSnap: swipi.selectedScrollSnap(),
      scrollSnapList: swipi.scrollSnapList(),
      canScrollNext: swipi.canScrollNext(),
      canScrollPrev: swipi.canScrollPrev()
    })
  }

  const reset = (): void => {
    setState(DEFAULT_STATE)
    setEvents([])
    setReadings(undefined)
    setRemountToken((token) => token + 1)
  }

  const copyCode = (): void => {
    void navigator.clipboard.writeText(code).then(() => {
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 1500)
    })
  }

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
          <button
            type="button"
            className="pg-button"
            onClick={() => setRemountToken((token) => token + 1)}
          >
            Remount
          </button>
          <button type="button" className="pg-button" onClick={reset}>
            Reset props
          </button>
        </div>
      </header>

      <div className="pg-layout">
        <aside className="pg-controls">
          <Section title="Slides">
            <NumberField
              label="Slides in the playground"
              hint="Amount of children passed to Swipi"
              value={state.slidesCount}
              min={MIN_SLIDES_COUNT}
              max={MAX_SLIDES_COUNT}
              onChange={(value) => update('slidesCount', value)}
            />
            <NumberField
              label="slidesNumber"
              hint="Visible slides (ignored when config matches or with fade-in)"
              value={state.slidesNumber}
              min={1}
              max={6}
              onChange={(value) => update('slidesNumber', value)}
            />
            <NumberField
              label="spaceBetweenSlides"
              value={state.spaceBetweenSlides}
              min={0}
              max={80}
              onChange={(value) => update('spaceBetweenSlides', value)}
            />
            <NumberField
              label="initialSlide"
              hint="1-based, applied on mount only — changing it remounts the slider"
              value={state.initialSlide}
              min={0}
              max={state.slidesCount}
              onChange={(value) => update('initialSlide', value)}
            />
            <SelectField
              label="slidesAnimation"
              value={state.slidesAnimation}
              options={SLIDES_ANIMATION_OPTIONS}
              onChange={(value) => update('slidesAnimation', value)}
            />
            <Toggle
              label="biasRight"
              hint="Shows a piece of the next slide (default animation only)"
              checked={state.biasRight}
              onChange={(value) => update('biasRight', value)}
            />
          </Section>

          <Section title="Behaviour">
            <Toggle
              label="loop"
              hint="Infinite scrolling — needs more slides than visible ones"
              checked={state.loop}
              onChange={(value) => update('loop', value)}
            />
            <Toggle
              label="autoplay"
              checked={state.autoplay}
              onChange={(value) => update('autoplay', value)}
            />
            <NumberField
              label="autoplaySpeed"
              hint="Interval between slides, ms"
              value={state.autoplaySpeed}
              min={500}
              max={10000}
              step={100}
              disabled={!state.autoplay}
              onChange={(value) => update('autoplaySpeed', value)}
            />
            <NumberField
              label="animationSpeed"
              hint="Transition duration, ms"
              value={state.animationSpeed}
              min={0}
              max={2000}
              step={50}
              onChange={(value) => update('animationSpeed', value)}
            />
          </Section>

          <Section title="Arrows">
            <Toggle
              label="showArrows"
              checked={state.showArrows}
              onChange={(value) => update('showArrows', value)}
            />
            <TextField
              label="prevButton"
              value={state.prevButton}
              onChange={(value) => update('prevButton', value)}
            />
            <TextField
              label="nextButton"
              value={state.nextButton}
              onChange={(value) => update('nextButton', value)}
            />
          </Section>

          <Section title="Dots">
            <Toggle
              label="showDots"
              checked={state.showDots}
              onChange={(value) => update('showDots', value)}
            />
            <SelectField
              label="dotsAnimation"
              value={state.dotsAnimation}
              options={DOTS_ANIMATION_OPTIONS}
              onChange={(value) => update('dotsAnimation', value)}
            />
            <ColorField
              label="dotColor"
              value={state.dotColor}
              onChange={(value) => update('dotColor', value)}
            />
            <ColorField
              label="activeDotColor"
              value={state.activeDotColor}
              onChange={(value) => update('activeDotColor', value)}
            />
            <NumberField
              label="sizeForDefaultDot"
              value={state.sizeForDefaultDot}
              min={4}
              max={40}
              onChange={(value) => update('sizeForDefaultDot', value)}
            />
            <NumberField
              label="sizeForDefaultActiveDot"
              value={state.sizeForDefaultActiveDot}
              min={4}
              max={40}
              onChange={(value) => update('sizeForDefaultActiveDot', value)}
            />
            <Toggle
              label="customDot"
              hint="Replaces the default dot with a custom element"
              checked={state.customDot}
              onChange={(value) => update('customDot', value)}
            />
            <Toggle
              label="customActiveDot"
              hint="Replaces the default active dot with a custom element"
              checked={state.customActiveDot}
              onChange={(value) => update('customActiveDot', value)}
            />
          </Section>

          <Section title="Responsive config">
            <Toggle
              label="config"
              hint="Breakpoints that override slidesNumber, spaceBetween and biasRight"
              checked={state.useConfig}
              onChange={(value) => update('useConfig', value)}
            />
            <ConfigEditor
              config={state.config}
              disabled={!state.useConfig}
              onChange={(value) => update('config', value)}
            />
          </Section>

          <Section title="Accessibility & styling">
            <TextField
              label="ariaLabel"
              value={state.ariaLabel}
              onChange={(value) => update('ariaLabel', value)}
            />
            <TextField
              label="className"
              placeholder="my-slider"
              value={state.className}
              onChange={(value) => update('className', value)}
            />
          </Section>

          <Section title="Stage">
            <NumberField
              label="Stage width"
              hint="Width of the container around the slider, px"
              value={state.stageWidth}
              min={240}
              max={1440}
              step={10}
              onChange={(value) => update('stageWidth', value)}
            />
            <div className="pg-row">
              {STAGE_PRESETS.map((preset) => (
                <button
                  key={preset.label}
                  type="button"
                  className="pg-button pg-button--ghost"
                  onClick={() => update('stageWidth', preset.width)}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </Section>
        </aside>

        <main className="pg-stage">
          <div className="pg-card">
            <div
              className="pg-stage__slider"
              style={{ width: state.stageWidth }}
            >
              <Swipi
                key={`${remountToken}-${state.initialSlide}`}
                ref={swipiRef}
                loop={state.loop}
                biasRight={state.biasRight}
                showDots={state.showDots}
                autoplay={state.autoplay}
                showArrows={state.showArrows}
                initialSlide={state.initialSlide}
                slidesNumber={state.slidesNumber}
                config={state.useConfig ? state.config : undefined}
                autoplaySpeed={state.autoplaySpeed}
                animationSpeed={state.animationSpeed}
                spaceBetweenSlides={state.spaceBetweenSlides}
                dotColor={state.dotColor}
                activeDotColor={state.activeDotColor}
                sizeForDefaultDot={state.sizeForDefaultDot}
                sizeForDefaultActiveDot={state.sizeForDefaultActiveDot}
                dotsAnimation={state.dotsAnimation}
                slidesAnimation={state.slidesAnimation}
                customDot={state.customDot ? CUSTOM_DOT : undefined}
                customActiveDot={
                  state.customActiveDot ? CUSTOM_ACTIVE_DOT : undefined
                }
                prevButton={state.prevButton}
                nextButton={state.nextButton}
                className={state.className || undefined}
                ariaLabel={state.ariaLabel}
                onSelect={handleSelect}
                onChange={handleChange}
              >
                {slides.map((color, index) => (
                  <div
                    key={color}
                    className="pg-slide"
                    style={{ backgroundColor: color }}
                  >
                    {index + 1}
                  </div>
                ))}
              </Swipi>
            </div>

            <ul className="pg-facts">
              <li>
                window width: <b>{windowWidth}px</b>
              </li>
              <li>
                visible slides: <b>{visibleSlides}</b>
              </li>
              <li>
                active breakpoint:{' '}
                <b>
                  {activeBreakpoint
                    ? `maxWidth ${activeBreakpoint.maxWidth}`
                    : 'none'}
                </b>
              </li>
            </ul>

            {!areArrowsAvailable && (
              <p className="pg-warning">
                All slides fit on the screen, so arrows, dots navigation and{' '}
                <code>loop</code> are disabled — add more slides or decrease{' '}
                <code>slidesNumber</code>.
              </p>
            )}
          </div>

          <div className="pg-card">
            <h2 className="pg-card__title">Imperative API (ref)</h2>
            <div className="pg-row">
              <button
                type="button"
                className="pg-button"
                onClick={() => swipiRef.current?.scrollPrev()}
              >
                scrollPrev()
              </button>
              <button
                type="button"
                className="pg-button"
                onClick={() => swipiRef.current?.scrollNext()}
              >
                scrollNext()
              </button>
              <span className="pg-row__group">
                <input
                  type="number"
                  className="pg-input pg-input--number"
                  aria-label="Slide index for scrollTo"
                  min={0}
                  max={Math.max(state.slidesCount - 1, 0)}
                  value={scrollToIndex}
                  onChange={(event) =>
                    setScrollToIndex(Number(event.target.value))
                  }
                />
                <button
                  type="button"
                  className="pg-button"
                  onClick={() => swipiRef.current?.scrollTo(scrollToIndex)}
                >
                  scrollTo(index)
                </button>
              </span>
              <button
                type="button"
                className="pg-button pg-button--ghost"
                onClick={readRefState}
              >
                Read ref state
              </button>
            </div>
            {readings && (
              <pre className="pg-code">{JSON.stringify(readings, null, 2)}</pre>
            )}
          </div>

          <div className="pg-card pg-card--split">
            <div>
              <h2 className="pg-card__title">onSelect state</h2>
              <pre className="pg-code">
                {JSON.stringify(swipiState, null, 2)}
              </pre>
            </div>
            <div>
              <h2 className="pg-card__title">onChange positions</h2>
              <pre className="pg-code">
                {JSON.stringify(positions, null, 2)}
              </pre>
            </div>
          </div>

          <div className="pg-card">
            <div className="pg-card__header">
              <h2 className="pg-card__title">Events</h2>
              <button
                type="button"
                className="pg-button pg-button--ghost"
                onClick={() => setEvents([])}
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

          <div className="pg-card">
            <div className="pg-card__header">
              <h2 className="pg-card__title">Generated code</h2>
              <button type="button" className="pg-button" onClick={copyCode}>
                {isCopied ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <pre className="pg-code">{code}</pre>
          </div>
        </main>
      </div>
    </div>
  )
}

export default Playground
