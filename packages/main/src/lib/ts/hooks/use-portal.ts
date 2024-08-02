import { createPortal } from 'react-dom'
import { useState, useLayoutEffect } from 'react'

const isServer = typeof window === 'undefined'
export const PORTAL_CONTAINER_TEST_ID = 'portal-container'

export function usePortal() {
  const [wrapperElement] = useState<HTMLDivElement | null>(() => {
    if (isServer) return null
    const container = document.createElement('div')
    if (import.meta.env.MODE === 'test') {
      container.setAttribute('data-testid', PORTAL_CONTAINER_TEST_ID)
    }
    return container
  })

  useLayoutEffect(() => {
    if (wrapperElement === null) return
    document.body.appendChild(wrapperElement)

    return () => {
      document.body.removeChild(wrapperElement)
    }
  }, [wrapperElement])

  return {
    renderPortal: (children: React.ReactNode) => {
      return createPortal(children, wrapperElement as HTMLDivElement)
    }
  }
}
