import { ComponentBasicProps } from './types'

const CarouselWrapper = ({
  children,
  className = '',
  ...props
}: ComponentBasicProps): JSX.Element => (
  <div className={`swipi ${className}`} {...props}>
    {children}
  </div>
)

export default CarouselWrapper
