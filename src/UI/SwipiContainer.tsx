import { ComponentBasicProps } from './types'

const SwipiContainer = ({ children }: ComponentBasicProps): JSX.Element => (
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

export default SwipiContainer
