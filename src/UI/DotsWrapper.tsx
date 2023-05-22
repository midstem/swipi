import { ComponentBasicProps } from './types'

const DotsWrapper = ({ children }: ComponentBasicProps): JSX.Element => (
  <div className="dots-wrapper" data-cy="dots-wrapper">
    {children}
  </div>
)

export default DotsWrapper
