import { SlideProps } from './types'

export const Slide = ({
  slideWidth,
  spaceBetween,
  children,
  animation = {}
}: SlideProps): JSX.Element => (
  <div
    data-cy="slide"
    style={{
      boxSizing: 'border-box',
      width: `${slideWidth}px`,
      paddingRight: `${spaceBetween}px`,
      ...animation
    }}
  >
    {children}
  </div>
)
