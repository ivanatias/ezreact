import { useLayoutEffect, useEffect, useRef } from 'react'

export function useMatchMedia(mediaQuery, matchCallback) {
  const matchCallbackRef = useRef(matchCallback)

  useLayoutEffect(() => {
    const media = window.matchMedia(mediaQuery)

    const listener = (event) => {
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
