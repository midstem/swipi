import type { StyleObject } from '@swipi/playground-core'

const UNITLESS_PROPERTIES = [
  'opacity',
  'zIndex',
  'order',
  'flex',
  'flexGrow',
  'flexShrink',
  'fontWeight',
  'lineHeight',
  'zoom'
]

const toDeclaration = (property: string, value: string | number): string => {
  const isPixels =
    typeof value === 'number' && !UNITLESS_PROPERTIES.includes(property)

  return `${property}: ${isPixels ? `${value}px` : String(value)}`
}

export const toStyle = (style: StyleObject): string =>
  Object.entries(style)
    .filter(([, value]) => value !== undefined)
    .map(([property, value]) =>
      toDeclaration(property, value as string | number)
    )
    .join('; ')

export const toRange = (length: number): number[] =>
  Array.from({ length }, (_, index) => index)

const ID_RADIX = 36

const ID_START = 2

const ID_END = 9

export const createFieldId = (prefix: string): string =>
  `${prefix}-${Math.random().toString(ID_RADIX).slice(ID_START, ID_END)}`
