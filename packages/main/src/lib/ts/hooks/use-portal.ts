import { createPortal } from 'react-dom'
import { useState, useLayoutEffect, type ReactPortal, type ReactNode } from 'react'

const isServer = typeof window === 'undefined'

export function usePortal() {
  const [wrapperElement] = useState<HTMLDivElement | null>(() => {
    if (isServer) return null
    return document.createElement('div')
  })

  useLayoutEffect(() => {
    if (wrapperElement === null) return
    document.body.appendChild(wrapperElement)

    return () => {
      document.body.removeChild(wrapperElement)
    }
  }, [wrapperElement])

  return {
    renderPortal: (children: ReactNode): ReactPortal | null => {
      return wrapperElement === null ? null : createPortal(children, wrapperElement)
    }
  }
}
