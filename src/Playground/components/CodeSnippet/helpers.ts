import { ConfigType } from '../../../Swipi/types'
import { SWIPI_DEFAULTS } from '../../constants'
import { PlaygroundState } from '../../types'
import { INDENT, SNIPPET_PROPS } from './constants'

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
