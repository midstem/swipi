import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { JSDOM } from 'jsdom'

const VIEWPORT_WIDTH = 900

const SLIDE_WIDTH = 300

const TRANSLATE = /translate3d\((-?[\d.]+)px/

export const SLIDES = ['one', 'two', 'three', 'four']

export const BROWSER_DIR = resolve('dist', 'app', 'browser')

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

export const readBuiltHtml = (file) =>
  readFileSync(join(BROWSER_DIR, file), 'utf8')

export const readBuiltEntry = (file) => {
  const match = /<script[^>]+src="\/?([^"]+\.js)"/.exec(readBuiltHtml(file))

  assert.ok(match, `${file} has no module entry`)

  return join(BROWSER_DIR, match[1])
}

export const createDom = (html) => {
  const dom = new JSDOM(html, {
    pretendToBeVisual: true,
    url: 'http://127.0.0.1/'
  })

  const { window } = dom

  simulateLayout(window)

  const elementConstructors = Object.fromEntries(
    Object.getOwnPropertyNames(window)
      .filter((name) => name.startsWith('HTML'))
      .map((name) => [name, window[name]])
  )

  const globals = {
    ...elementConstructors,
    window,
    document: window.document,
    navigator: window.navigator,
    location: window.location,
    history: window.history,
    Element: window.Element,
    HTMLElement: window.HTMLElement,
    SVGElement: window.SVGElement,
    Node: window.Node,
    Text: window.Text,
    Comment: window.Comment,
    DocumentFragment: window.DocumentFragment,
    Range: window.Range,
    Event: window.Event,
    CustomEvent: window.CustomEvent,
    MouseEvent: window.MouseEvent,
    PointerEvent: window.MouseEvent,
    MutationObserver: window.MutationObserver,
    ResizeObserver: window.ResizeObserver,
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

export const readState = (window) => {
  const state = window.document.querySelector('#state')

  assert.ok(state, 'the app did not render the carousel')

  return state.textContent.split('/').map(Number)
}

export const waitFor = async (assertion, timeout = 5000) => {
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
