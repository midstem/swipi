import {
  ANY_ORIGIN,
  EMBED_HEIGHT_MESSAGE,
  EMBED_MEASURE_MESSAGE,
  EMBED_QUERY_KEY,
  EMBED_READY_MESSAGE
} from '../constants'
import { EmbedMeasureMessage, EmbedMessage } from '../types'

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

const send = (message: EmbedMessage, origin: string): void => {
  window.parent.postMessage(message, origin)
}

export const startEmbedBridge = (): (() => void) => {
  if (!isEmbedded()) return noop

  document.documentElement.dataset.embed = 'true'

  if (!isInsideFrame()) return noop

  const origin = getParentOrigin()

  let reported = NO_HEIGHT

  const report = (force = false): void => {
    const height = Math.ceil(document.body.getBoundingClientRect().height)

    if (height === reported && !force) return

    reported = height
    send({ type: EMBED_HEIGHT_MESSAGE, height }, origin)
  }

  const receive = ({
    origin: from,
    data
  }: MessageEvent<EmbedMeasureMessage>): void => {
    if (origin !== ANY_ORIGIN && from !== origin) return

    if (data?.type !== EMBED_MEASURE_MESSAGE) return

    report(true)
  }

  const observer = new ResizeObserver(() => report())

  observer.observe(document.body)
  window.addEventListener('message', receive)

  send({ type: EMBED_READY_MESSAGE }, origin)
  report(true)

  return () => {
    observer.disconnect()
    window.removeEventListener('message', receive)
  }
}
