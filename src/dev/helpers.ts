import { ConfigType } from '../Swipi/types'
import { DEFAULT_STATE, STORAGE_KEY, SWIPI_DEFAULTS } from './constants'
import { PlaygroundState, PlaygroundStateKey } from './types'

type SnippetPropKey = keyof typeof SWIPI_DEFAULTS

const SNIPPET_PROPS: SnippetPropKey[] = [
  'loop',
  'autoplay',
  'autoplaySpeed',
  'showDots',
  'showArrows',
  'biasRight',
  'initialSlide',
  'slidesNumber',
  'spaceBetweenSlides',
  'animationSpeed',
  'slidesAnimation',
  'dotsAnimation',
  'dotColor',
  'activeDotColor',
  'sizeForDefaultDot',
  'sizeForDefaultActiveDot',
  'prevButton',
  'nextButton',
  'className',
  'ariaLabel'
]

const INDENT = '  '

const buildPropLine = (
  key: string,
  value: string | number | boolean
): string => {
  if (typeof value === 'boolean') {
    return value ? `${INDENT}${key}` : `${INDENT}${key}={false}`
  }

  if (typeof value === 'number') return `${INDENT}${key}={${value}}`

  return `${INDENT}${key}="${value}"`
}

const formatConfigItem = (item: ConfigType): string => {
  const entries = Object.entries(item)
    .map(([key, value]) => `${key}: ${String(value)}`)
    .join(', ')

  return `${INDENT.repeat(2)}{ ${entries} }`
}

const buildConfigLine = (config: ConfigType[]): string =>
  `${INDENT}config={[\n${config.map(formatConfigItem).join(',\n')}\n${INDENT}]}`

export const buildCodeSnippet = (state: PlaygroundState): string => {
  const lines = SNIPPET_PROPS.filter(
    (key) => state[key] !== SWIPI_DEFAULTS[key]
  ).map((key) => buildPropLine(key, state[key]))

  if (state.customDot) lines.push(`${INDENT}customDot={<CustomDot />}`)

  if (state.customActiveDot) {
    lines.push(`${INDENT}customActiveDot={<CustomActiveDot />}`)
  }

  if (state.useConfig && state.config.length) {
    lines.push(buildConfigLine(state.config))
  }

  lines.push(`${INDENT}onSelect={setState}`)

  return [
    '<Swipi',
    ...lines,
    '>',
    `${INDENT}{slides.map((color) => (`,
    `${INDENT.repeat(2)}<div key={color} style={{ height: 250, background: color }} />`,
    `${INDENT}))}`,
    '</Swipi>'
  ].join('\n')
}

const isSameShape = (key: PlaygroundStateKey, value: unknown): boolean => {
  if (key === 'config') return Array.isArray(value)

  return typeof value === typeof DEFAULT_STATE[key]
}

export const loadState = (): PlaygroundState => {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)

    if (!raw) return DEFAULT_STATE

    const parsed = JSON.parse(raw) as Record<string, unknown>
    const state = { ...DEFAULT_STATE }

    Object.keys(DEFAULT_STATE).forEach((key) => {
      const stateKey = key as PlaygroundStateKey
      const value = parsed[key]

      if (value === undefined || !isSameShape(stateKey, value)) return

      Object.assign(state, { [stateKey]: value })
    })

    return state
  } catch {
    return DEFAULT_STATE
  }
}

export const saveState = (state: PlaygroundState): void => {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    /* storage is not available — the playground still works */
  }
}
