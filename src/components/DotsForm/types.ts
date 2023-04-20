export type DotsFormProps = {
  showDots: boolean
  sizeForDefaultDot: number
  customDot: string
  customActiveDot: string
  setShowDots: (a: boolean) => void
  setSizeForDefaultDot: (a: number) => void
  setSizeForDefaultActiveDot: (a: number) => void
  setDotColor: (a: string) => void
  setActiveDotColor: (a: string) => void
  setDotsAnimation: (a: string) => void
  setCustomDot: (a: string) => void
  setCustomActiveDot: (a: string) => void
}
