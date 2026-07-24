import type { JSX } from 'react'
import { forwardRef } from 'react'
import { SwipiButtonProps } from './types'

const SwipiButton = forwardRef<HTMLButtonElement, SwipiButtonProps>(
  ({ children, onClick, className, disabled }, ref): JSX.Element => (
    <button
      aria-label={className}
      disabled={disabled}
      className={className}
      ref={ref}
      onClick={onClick}
      type="button"
    >
      {children}
    </button>
  )
)

export default SwipiButton
