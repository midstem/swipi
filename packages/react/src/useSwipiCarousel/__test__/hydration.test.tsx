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

const hydrate = (ui: JSX.Element): HTMLElement => {
  const container = document.createElement('div')

  container.innerHTML = renderToString(ui)
  document.body.appendChild(container)

  act(() => {
    root = hydrateRoot(container, ui)
  })

  return container
}

afterEach(() => {
  act(() => root?.unmount())
  root = null
  document.body.innerHTML = ''
  vi.restoreAllMocks()
})

describe('useSwipiCarousel hydration', () => {
  it('says nothing to the console while hydrating', () => {
    const messages = listenToConsole()

    hydrate(<Carousel loop />)

    expect(messages).toEqual([])
  })

  it('says nothing to the console while hydrating in StrictMode', () => {
    const messages = listenToConsole()

    hydrate(
      <StrictMode>
        <Carousel />
      </StrictMode>
    )

    expect(messages).toEqual([])
  })

  it('measures the carousel once it is hydrated', () => {
    hydrate(<Carousel />)

    expect(readState()).toBe('0/4/4/false/true/true')
  })
})
