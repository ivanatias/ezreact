import { useEffect } from 'react'

export function usePageVisibility(callback) {
  useEffect(() => {
    const listener = () => {
      callback(document.hidden)
    }

    document.addEventListener('visibilitychange', listener)

    return () => {
      document.removeEventListener('visibilitychange', listener)
    }
  }, [callback])
}
