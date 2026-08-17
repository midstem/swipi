import { StrictMode, type JSX } from 'react'
import { renderToString } from 'react-dom/server'
import { hydrateRoot, type Root } from 'react-dom/client'
import { act } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { Carousel } from './carousel'
import { readState } from './dom'

let root: Root | null = null

const listenToConsole = (): string[] => {
  const messages: string[] = []
  const record = (...args: unknown[]): void => {
    messages.push(args.map(String).join(' '))
  }

  vi.spyOn(console, 'error').mockImplementation(record)
  vi.spyOn(console, 'warn').mockImplementation(record)

  return messages
}

const renderOnServer = (ui: JSX.Element): HTMLElement => {
  const container = document.createElement('div')

  container.innerHTML = renderToString(ui)
  document.body.appendChild(container)

  return container
}

const hydrate = (container: HTMLElement, ui: JSX.Element): void => {
  act(() => {
    root = hydrateRoot(container, ui)
  })
}

afterEach(() => {
  act(() => root?.unmount())
  root = null
  document.body.innerHTML = ''
  vi.restoreAllMocks()
})

describe('useSwipiCarousel hydration', () => {
  it('says nothing to the console while hydrating', () => {
    const ui = <Carousel loop />
    const container = renderOnServer(ui)

    const messages = listenToConsole()

    hydrate(container, ui)

    expect(messages).toEqual([])
  })

  it('says nothing to the console while hydrating in StrictMode', () => {
    const ui = (
      <StrictMode>
        <Carousel />
      </StrictMode>
    )
    const container = renderOnServer(ui)

    const messages = listenToConsole()

    hydrate(container, ui)

    expect(messages).toEqual([])
  })

  it('measures the carousel once it is hydrated', () => {
    const ui = <Carousel />

    hydrate(renderOnServer(ui), ui)

    expect(readState()).toBe('0/4/4/false/true/true')
  })
})
