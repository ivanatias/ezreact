import { useRef, useLayoutEffect } from 'react'

export function useScrollHide() {
  const elementRef = useRef(null)
  const defaultStyle = useRef({
    overflow: 'auto'
  })

  useLayoutEffect(() => {
    const getElement = () => elementRef.current ?? document.querySelector('body')

    const hideScroll = () => {
      const element = getElement()
      defaultStyle.current.overflow = element.style.overflow
      element.style.overflow = 'hidden'
    }

    const showScroll = () => {
      const element = getElement()
      element.style.overflow = defaultStyle.current.overflow
    }

    hideScroll()

    return showScroll
  }, [])

  return elementRef
}
