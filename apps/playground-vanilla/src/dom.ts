import type { StyleObject } from '@swipi/playground-core'

type Attributes = Record<string, string | number | boolean | undefined>

type Child = Node | string

const SVG_NAMESPACE = 'http://www.w3.org/2000/svg'

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

const CUSTOM_PROPERTY_PREFIX = '--'

const written = new WeakMap<Element, string[]>()

let lastId = 0

export const createId = (prefix: string): string => {
  lastId += 1

  return `${prefix}-${lastId}`
}

const toProperty = (property: string): string =>
  property.startsWith(CUSTOM_PROPERTY_PREFIX)
    ? property
    : property.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`)

const toValue = (property: string, value: string | number): string =>
  typeof value === 'number' && !UNITLESS_PROPERTIES.includes(property)
    ? `${value}px`
    : String(value)

export const applyStyle = (node: HTMLElement, style: StyleObject): void => {
  const entries = Object.entries(style).filter(
    ([, value]) => value !== undefined
  )

  written.get(node)?.forEach((property) => node.style.removeProperty(property))

  entries.forEach(([property, value]) =>
    node.style.setProperty(
      toProperty(property),
      toValue(property, value as string | number)
    )
  )

  written.set(
    node,
    entries.map(([property]) => toProperty(property))
  )
}

export const setAttributes = (node: Element, attributes: Attributes): void =>
  Object.entries(attributes).forEach(([name, value]) => {
    if (value === undefined || value === false) {
      node.removeAttribute(name)

      return
    }

    node.setAttribute(name, value === true ? '' : String(value))
  })

export const append = (node: Element, children: Child[]): void =>
  children.forEach((child) => node.append(child))

export const clear = (node: Element): void => node.replaceChildren()

export const element = <Tag extends keyof HTMLElementTagNameMap>(
  tag: Tag,
  attributes: Attributes = {},
  children: Child[] = []
): HTMLElementTagNameMap[Tag] => {
  const node = document.createElement(tag)

  setAttributes(node, attributes)
  append(node, children)

  return node
}

export const svgElement = <Tag extends keyof SVGElementTagNameMap>(
  tag: Tag,
  attributes: Attributes = {},
  children: Child[] = []
): SVGElementTagNameMap[Tag] => {
  const node = document.createElementNS(SVG_NAMESPACE, tag)

  setAttributes(node, attributes)
  append(node, children)

  return node
}

export const setValue = (
  input: HTMLInputElement | HTMLSelectElement,
  value: string
): void => {
  if (input.value === value) return

  input.value = value
}

export const setText = (node: Element, text: string): void => {
  if (node.textContent === text) return

  node.textContent = text
}
