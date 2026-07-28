import type { JSX } from 'react'
import { SlidesWrapperProps } from './types'

const SlidesWrapper = ({
  children,
  slidesWrapperRef,
  onPointerDown,
  onPointerMove,
  onPointerUp
}: SlidesWrapperProps): JSX.Element => (
  <div
    ref={slidesWrapperRef}
    className="swipi-viewport"
    onPointerDown={onPointerDown}
    onPointerMove={onPointerMove}
    onPointerUp={onPointerUp}
    onPointerCancel={onPointerUp}
  >
    {children}
  </div>
)

export default SlidesWrapper
