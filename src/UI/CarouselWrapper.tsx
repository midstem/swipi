import { ComponentBasicProps } from './types'
import './styles.css'

const CarouselWrapper = ({
  children,
  className = '',
  ...props
}: ComponentBasicProps): JSX.Element => (
  <div className={`slider ${className}`} {...props}>
    {children}
  </div>
)

export default CarouselWrapper
