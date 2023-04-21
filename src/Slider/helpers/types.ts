export type NavigationAllowed = (
  loop: boolean,
  slideIndex: number,
  slideWidth: number
) => (isGrab?: boolean, nextSlide?: boolean) => boolean
