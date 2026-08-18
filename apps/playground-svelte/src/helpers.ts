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
