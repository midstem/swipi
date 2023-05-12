import { useState, useRef, useEffect, useCallback } from 'react'

export const useDebounce = (callback: () => void, delay: number) => {
  const [isDisabled, setIsDisabled] = useState(false)
  const timer = useRef<NodeJS.Timer>()

  const debounce = useCallback(() => {
    if (!isDisabled) {
      setIsDisabled(true)
      callback()

      timer.current = setTimeout(() => {
        setIsDisabled(false)
      }, delay)
    }
  }, [isDisabled, callback, delay])

  useEffect(() => {
    return () => {
      clearTimeout(timer.current)
    }
  }, [])

  return debounce
}
