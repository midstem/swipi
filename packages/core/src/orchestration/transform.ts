import { easeOutCubic, INITIAL_TRANSFORM, PROGRESS_END } from '../index'

export type TransformContext = {
  transform: number
  target: number
}

export type SetupTransformProps = {
  render: (value: number) => void
  onTarget: (value: number) => void
}

export type TransformApi = {
  getContext: () => TransformContext
  moveTo: (value: number) => void
  animateTo: (
    value: number,
    duration: number,
    prefersReducedMotion: boolean
  ) => void
  destroy: () => void
}

export const setupTransform = ({
  render,
  onTarget
}: SetupTransformProps): TransformApi => {
  const context: TransformContext = {
    transform: INITIAL_TRANSFORM,
    target: INITIAL_TRANSFORM
  }
  let frameId: number | null = null

  const cancelAnimation = (): void => {
    if (frameId === null) return
    cancelAnimationFrame(frameId)
    frameId = null
  }

  const applyTransform = (value: number): void => {
    context.transform = value
    render(value)
  }

  const applyTarget = (value: number): void => {
    context.target = value
    onTarget(value)
  }

  const moveTo = (value: number): void => {
    cancelAnimation()
    applyTarget(value)
    applyTransform(value)
  }

  const animateTo = (
    value: number,
    duration: number,
    prefersReducedMotion: boolean
  ): void => {
    cancelAnimation()
    applyTarget(value)

    const from = context.transform
    const distance = value - from

    if (!distance || duration <= 0 || prefersReducedMotion) {
      applyTransform(value)
      return
    }

    let startedAt: number | null = null

    const step = (now: number): void => {
      startedAt ??= now

      const progress = Math.min((now - startedAt) / duration, PROGRESS_END)

      applyTransform(from + distance * easeOutCubic(progress))

      frameId = progress < PROGRESS_END ? requestAnimationFrame(step) : null
    }

    frameId = requestAnimationFrame(step)
  }

  const destroy = (): void => {
    cancelAnimation()
  }

  return { getContext: () => context, moveTo, animateTo, destroy }
}
