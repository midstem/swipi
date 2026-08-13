// @ts-nocheck
import { MutableRefObject, useRef } from 'react'

export const useLatestRef = <T>(value: T): MutableRefObject<T> => {
  const ref = useRef(value)

  ref.current = value

  return ref
}
