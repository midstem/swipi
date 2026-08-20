import {
  ANY_ORIGIN,
  EMBED_HEIGHT_MESSAGE,
  EMBED_QUERY_KEY,
  EMBED_READY_MESSAGE,
  EMBED_THEME_MESSAGE,
  EMBED_THEMES
} from '../constants'
import { EmbedMessage, EmbedTheme } from '../types'

const NO_HEIGHT = 0

const noop = (): void => {}

const isInsideFrame = (): boolean => window.self !== window.top

export const isEmbedded = (): boolean =>
  isInsideFrame() ||
  new URLSearchParams(window.location.search).has(EMBED_QUERY_KEY)

const getParentOrigin = (): string => {
  try {
    return new URL(document.referrer).origin
  } catch {
    return ANY_ORIGIN
  }
}

const isTheme = (value: unknown): value is EmbedTheme =>
  EMBED_THEMES.some((theme) => theme === value)

const send = (message: EmbedMessage, origin: string): void => {
  window.parent.postMessage(message, origin)
}

export const startEmbedBridge = (): (() => void) => {
  if (!isEmbedded()) return noop

  document.documentElement.dataset.embed = 'true'

  if (!isInsideFrame()) return noop

  const origin = getParentOrigin()

  let reported = NO_HEIGHT

  const report = (): void => {
    const height = Math.ceil(document.body.getBoundingClientRect().height)

    if (height === reported) return

    reported = height
    send({ type: EMBED_HEIGHT_MESSAGE, height }, origin)
  }

  const receive = ({
    origin: from,
    data
  }: MessageEvent<EmbedMessage>): void => {
    if (origin !== ANY_ORIGIN && from !== origin) return

    if (data?.type !== EMBED_THEME_MESSAGE || !isTheme(data.theme)) return

    document.documentElement.dataset.theme = data.theme
  }

  const observer = new ResizeObserver(report)

  observer.observe(document.body)
  window.addEventListener('message', receive)

  send({ type: EMBED_READY_MESSAGE }, origin)
  report()

  return () => {
    observer.disconnect()
    window.removeEventListener('message', receive)
  }
}
