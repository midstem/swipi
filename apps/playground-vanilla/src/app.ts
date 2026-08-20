import { element, svgElement } from './dom'
import { createPlayground } from './playground'
import { createCodeSnippet } from './components/CodeSnippet'
import { createControlsPanel } from './components/ControlsPanel'
import { createEventLog } from './components/EventLog'
import { createImperativeApi } from './components/ImperativeApi'
import { createStage } from './components/Stage'
import { createStatePanel } from './components/StatePanel'
import type { PlaygroundSnapshot, StageComponent } from './types'
import { STYLES } from '@swipi/playground-core'

const LOGO_SIZE = 24

const NO_REMOUNT_KEY = ''

const createLogo = (): SVGSVGElement =>
  svgElement(
    'svg',
    { viewBox: '0 0 32 32', width: LOGO_SIZE, height: LOGO_SIZE },
    [
      svgElement('rect', { width: 32, height: 32, rx: 6, fill: '#f7df1e' }),
      svgElement(
        'text',
        {
          x: 16,
          y: 23,
          fill: '#000',
          'text-anchor': 'middle',
          'font-size': 16,
          'font-weight': 700,
          'font-family': 'inherit'
        },
        ['JS']
      )
    ]
  )

const createHeaderButton = (
  label: string,
  onClick: () => void
): HTMLElement => {
  const button = element('button', {
    type: 'button',
    class: STYLES.ghostButton
  })

  button.textContent = label
  button.addEventListener('click', onClick)

  return button
}

export const createApp = (root: HTMLElement): void => {
  const playground = createPlayground()

  let stage: StageComponent | null = null
  let remountKey = NO_REMOUNT_KEY

  const snapshot = playground.getSnapshot()

  const controls = createControlsPanel({
    state: snapshot.state,
    update: playground.update
  })

  const imperativeApi = createImperativeApi({
    carousel: snapshot.carousel,
    slidesCount: snapshot.state.slidesCount
  })

  const statePanel = createStatePanel({
    swipiState: snapshot.swipiState,
    positions: snapshot.positions
  })

  const eventLog = createEventLog({
    events: snapshot.events,
    onClear: playground.clearEvents
  })

  const codeSnippet = createCodeSnippet({ state: snapshot.state })

  const main = element('main', { class: STYLES.stage }, [
    imperativeApi.element,
    statePanel.element,
    eventLog.element,
    codeSnippet.element
  ])

  const title = element('h1', { class: STYLES.headerTitle }, [
    createLogo(),
    'Swipi playground'
  ])

  const header = element('header', { class: STYLES.header }, [
    element('div', {}, [
      title,
      element('p', { class: STYLES.hint }, [
        'Every option of createSwipi is editable here, next to the layout the playground draws around it — and the panel below prints the call, the markup and the CSS your settings need.'
      ])
    ]),
    element('div', { class: STYLES.headerActions }, [
      createHeaderButton('Remount', playground.remount),
      createHeaderButton('Reset props', playground.reset)
    ])
  ])

  const app = element('div', { class: STYLES.page }, [
    header,
    element('div', { class: STYLES.layout }, [controls.element, main])
  ])

  const mountStage = (next: PlaygroundSnapshot): void => {
    stage?.destroy()
    stage?.element.remove()

    remountKey = next.remountKey

    stage = createStage({
      state: next.state,
      slides: next.slides,
      onSelect: playground.handleSelect,
      onChange: playground.handleChange
    })

    main.prepend(stage.element)
    playground.handleReady(stage.carousel)
  }

  const render = (): void => {
    const next = playground.getSnapshot()

    if (next.remountKey !== remountKey) mountStage(next)

    stage?.update({
      state: next.state,
      slides: next.slides,
      onSelect: playground.handleSelect,
      onChange: playground.handleChange
    })

    controls.update({ state: next.state, update: playground.update })
    imperativeApi.update({
      carousel: next.carousel,
      slidesCount: next.state.slidesCount
    })
    statePanel.update({
      swipiState: next.swipiState,
      positions: next.positions
    })
    eventLog.update({ events: next.events, onClear: playground.clearEvents })
    codeSnippet.update({ state: next.state })
  }

  root.append(app)
  render()

  playground.subscribe(render)
}
