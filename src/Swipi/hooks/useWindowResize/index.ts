import { useEffect, useRef } from 'react'

export const useWindowResize = (callback: () => void) => {
  const callbackRef = useRef(callback)

  callbackRef.current = callback

  useEffect(() => {
    const resizeHandler = () => callbackRef.current()

    window.addEventListener('resize', resizeHandler)

    return () => {
      window.removeEventListener('resize', resizeHandler)
    }
  }, [])
}
