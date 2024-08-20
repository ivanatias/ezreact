import { useRef, useLayoutEffect, type CSSProperties } from 'react'

export function useScrollHide<ElementType extends HTMLElement>() {
  const elementRef = useRef<ElementType>(null)
  const defaultStyle = useRef<Required<Pick<CSSProperties, 'overflow'>>>({
    overflow: 'auto'
  })

  useLayoutEffect(() => {
    const getElement = () =>
      elementRef.current ?? (document.querySelector('body') as HTMLElement)

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
