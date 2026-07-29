import type { JSX } from 'react'
import { memo, useCallback } from 'react'
import { DotButtonProps } from './types'

const DotButton = memo(function DotButton({
  index,
  isActive,
  dotsRef,
  style,
  onSelect,
  renderDot
}: DotButtonProps): JSX.Element {
  const setDotRef = useCallback(
    (node: HTMLButtonElement | null): void => {
      if (!dotsRef) return

      dotsRef.current[index] = node
    },
    [dotsRef, index]
  )

  const handleClick = useCallback(
    (): void => onSelect(index),
    [onSelect, index]
  )

  return (
    <button
      ref={setDotRef}
      type="button"
      className="swipi-dot"
      aria-label={`Go to slide ${index + 1}`}
      aria-current={isActive}
      style={style}
      onClick={handleClick}
    >
      {renderDot(index, isActive)}
    </button>
  )
})

export default DotButton
