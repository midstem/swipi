export type NavigationAllowed = (
  loop: boolean,
  slideIndex: number,
  children: JSX.Element[]
) => (nextSlide?: boolean) => boolean
