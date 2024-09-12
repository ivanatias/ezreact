import { useEffect } from 'react'

export function usePageVisibility(
  callback: (isPageHidden: boolean) => void | Promise<void>
) {
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
