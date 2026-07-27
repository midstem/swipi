import type { JSX } from 'react'
import { LiveRegionProps } from './types'

const LiveRegion = ({ current, total }: LiveRegionProps): JSX.Element => (
  <span className="swipi-visually-hidden" aria-live="polite" aria-atomic="true">
    {`Slide ${current} of ${total}`}
  </span>
)

export default LiveRegion
