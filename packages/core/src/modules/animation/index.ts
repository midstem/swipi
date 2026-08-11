export const easeOutCubic = (progress: number): number =>
  1 - Math.pow(1 - progress, 3)
