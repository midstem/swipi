import { ComponentBasicProps } from './types'

const SliderContainer = ({ children }: ComponentBasicProps): JSX.Element => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      width: '100%'
    }}
  >
    {children}
  </div>
)

export default SliderContainer
