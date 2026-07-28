import type { JSX } from 'react'
import { useState } from 'react'
import { SlidesContainerProps } from './types'

const SlidesContainer = ({
  children,
  transform
}: SlidesContainerProps): JSX.Element => {
  const [isDragging, setIsDragging] = useState<boolean>(false)

  const startDragging = () => setIsDragging(true)
  const stopDragging = () => setIsDragging(false)

  return (
    <div
      onDragStart={(e) => {
        e.preventDefault()
      }}
      onMouseDown={startDragging}
      onMouseUp={stopDragging}
      onMouseLeave={stopDragging}
      style={{
        display: 'flex',
        width: 'fit-content',
        transform: `translate3d(${transform}px, 0, 0)`,
        height: '100%',
        cursor: isDragging ? 'grabbing' : 'grab'
      }}
    >
      {children}
    </div>
  )
}

export default SlidesContainer
