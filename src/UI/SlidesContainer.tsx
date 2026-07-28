import type { DragEvent, JSX } from 'react'
import { SlidesContainerProps } from './types'

const preventDragStart = (event: DragEvent<HTMLDivElement>): void =>
  event.preventDefault()

const SlidesContainer = ({
  children,
  trackRef
}: SlidesContainerProps): JSX.Element => (
  <div ref={trackRef} className="swipi-track" onDragStart={preventDragStart}>
    {children}
  </div>
)

export default SlidesContainer
