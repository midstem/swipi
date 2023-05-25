import { ComponentBasicProps } from './types'

const SwipiContainer = ({
  children,
  className = '',
  ...props
}: ComponentBasicProps): JSX.Element => (
  <div className={`swipi-container ${className}`} {...props}>
    {children}
  </div>
)

export default SwipiContainer
