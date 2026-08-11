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
