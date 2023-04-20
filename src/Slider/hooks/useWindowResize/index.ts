import { useCallback, useEffect } from 'react'

export const useWindowResize = (callback: () => void) => {
  const resizeHandler = useCallback(callback, [callback])

  useEffect(() => {
    window.addEventListener('resize', resizeHandler)
    return () => {
      window.removeEventListener('resize', resizeHandler)
    }
  }, [resizeHandler])
}
