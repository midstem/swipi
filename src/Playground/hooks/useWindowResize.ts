import { useEffect } from 'react'
import { useLatestRef } from '../../Swipi/hooks/useLatestRef'

export const useWindowResize = (callback: () => void) => {
  const callbackRef = useLatestRef(callback)

  useEffect(() => {
    const resizeHandler = () => callbackRef.current()

    window.addEventListener('resize', resizeHandler)

    return () => {
      window.removeEventListener('resize', resizeHandler)
    }
  }, [callbackRef])
}
