import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { JSDOM } from 'jsdom'

const VIEWPORT_WIDTH = 900

const SLIDE_WIDTH = 300

const TRANSLATE = /translate3d\((-?[\d.]+)px/

const widthOf = (element) => {
  if (element.id === 'viewport') return VIEWPORT_WIDTH

  return element.parentElement?.id === 'track' ? SLIDE_WIDTH : VIEWPORT_WIDTH
}

const translateOf = (element) => {
  const match = TRANSLATE.exec(element.style?.transform ?? '')

  return match ? Number(match[1]) : 0
}

const leftOf = (element) => {
  const parent = element.parentElement

  if (!parent) return translateOf(element)

  let left = leftOf(parent) + translateOf(element)

  for (const sibling of parent.children) {
    if (sibling === element) break

    left += widthOf(sibling)
  }

  return left
}

const simulateLayout = (window) => {
  window.Element.prototype.getBoundingClientRect = function measure() {
    const width = widthOf(this)
    const left = leftOf(this)

    return {
      x: left,
      y: 0,
      top: 0,
      left,
      right: left + width,
      bottom: 0,
      width,
      height: 0,
      toJSON: () => ({})
    }
  }
}

export const createDom = () => {
  const dom = new JSDOM(
    '<!doctype html><html><body><div id="root"></div></body></html>',
    { pretendToBeVisual: true, url: 'http://127.0.0.1/' }
  )

  const { window } = dom

  simulateLayout(window)

  const globals = {
    window,
    document: window.document,
    navigator: window.navigator,
    Element: window.Element,
    HTMLElement: window.HTMLElement,
    SVGElement: window.SVGElement,
    Node: window.Node,
    Event: window.Event,
    MouseEvent: window.MouseEvent,
    PointerEvent: window.MouseEvent,
    MutationObserver: window.MutationObserver,
    getComputedStyle: window.getComputedStyle.bind(window),
    requestAnimationFrame: window.requestAnimationFrame.bind(window),
    cancelAnimationFrame: window.cancelAnimationFrame.bind(window)
  }

  Object.entries(globals).forEach(([name, value]) =>
    Object.defineProperty(globalThis, name, { value, configurable: true })
  )

  return window
}

export const listenToConsole = () => {
  const messages = []
  const levels = ['error', 'warn']
  const originals = levels.map((level) => [level, console[level]])

  levels.forEach((level) => {
    console[level] = (...args) => messages.push(args.map(String).join(' '))
  })

  return {
    messages,
    restore: () =>
      originals.forEach(([level, original]) => {
        console[level] = original
      })
  }
}

export const readBuiltEntry = () => {
  const html = readFileSync(resolve('dist', 'index.html'), 'utf8')
  const match = /<script[^>]+src="\/([^"]+\.js)"/.exec(html)

  assert.ok(match, 'the built app has no module entry')

  return resolve('dist', match[1])
}

export const waitFor = async (assertion, timeout = 2000) => {
  const deadline = Date.now() + timeout
  let lastError

  while (Date.now() < deadline) {
    try {
      return assertion()
    } catch (error) {
      lastError = error

      await new Promise((resolve) => setTimeout(resolve, 20))
    }
  }

  throw lastError
}
