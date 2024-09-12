import { useLayoutEffect, useEffect, useRef } from 'react'

export function useMatchMedia(
  mediaQuery: string,
  matchCallback: (matches: boolean) => void | Promise<void>
) {
  const matchCallbackRef = useRef(matchCallback)

  useLayoutEffect(() => {
    const media = window.matchMedia(mediaQuery)

    const listener = (event: MediaQueryListEvent) => {
      matchCallbackRef.current(event.matches)
    }

    media.addEventListener('change', listener)
    matchCallbackRef.current(media.matches)

    return () => {
      media.removeEventListener('change', listener)
    }
  }, [mediaQuery])

  useEffect(() => {
    matchCallbackRef.current = matchCallback
  })
}
