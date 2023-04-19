import { ComponentBasicProps } from './types'
import './styles.css'

const DotsWrapper = ({ children }: ComponentBasicProps): JSX.Element => (
  <div className="dots-wrapper">{children}</div>
)
export default DotsWrapper
