import { useEffect, useMemo, useRef, useState } from 'react'
import { UseCodeSnippetProps, UseCodeSnippetReturn } from '../../types'
import { COPIED_MESSAGE_DELAY } from './constants'
import { buildCodeSnippet } from './helpers'

export const useCodeSnippet = ({
  state
}: UseCodeSnippetProps): UseCodeSnippetReturn => {
  const [isCopied, setIsCopied] = useState<boolean>(false)

  const timeout = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  useEffect(() => () => clearTimeout(timeout.current), [])

  const code = useMemo(() => buildCodeSnippet(state), [state])

  const copy = (): void => {
    void navigator.clipboard.writeText(code).then(() => {
      setIsCopied(true)

      clearTimeout(timeout.current)

      timeout.current = setTimeout(
        () => setIsCopied(false),
        COPIED_MESSAGE_DELAY
      )
    })
  }

  return { code, isCopied, copy }
}
