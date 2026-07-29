import { CSSProperties } from 'react'

const FADE_TRANSITION = 'opacity 350ms cubic-bezier(0.25, 1, 0.5, 1) 0s'

const FADED_IN: CSSProperties = { opacity: 1, transition: FADE_TRANSITION }

const FADED_OUT: CSSProperties = { opacity: 0, transition: FADE_TRANSITION }

export const fadeIn = (isOpacity: boolean): CSSProperties =>
  isOpacity ? FADED_IN : FADED_OUT
