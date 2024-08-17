import { createPortal } from 'react-dom'
import { useState, useLayoutEffect } from 'react'

const isServer = typeof window === 'undefined'

export function usePortal() {
  const [wrapperElement] = useState(() => {
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
    renderPortal: (children) => {
      return wrapperElement === null ? null : createPortal(children, wrapperElement)
    }
  }
}
