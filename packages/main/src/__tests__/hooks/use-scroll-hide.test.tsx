import { screen, render } from '@testing-library/react'
import { useScrollHide } from 'lib/ts/hooks/use-scroll-hide'

describe('useScrollHide', () => {
  it('should hide body scroll if no reference is attached to DOM element and return it back to initial style after component unmount', () => {
    document.body.setAttribute('style', 'overflow: auto')

    const Component = () => {
      useScrollHide()
      return <h1>Test</h1>
    }

    const { baseElement, unmount } = render(<Component />)
    expect(baseElement).toHaveStyle({ overflow: 'hidden' })
    unmount()
    expect(baseElement).toHaveStyle({ overflow: 'auto' })
  })

  it('should hide scroll on the DOM element where the ref is attached', () => {
    const Component = () => {
      const ref = useScrollHide<HTMLDivElement>()
      return (
        <div ref={ref} style={{ overflow: 'auto' }}>
          Test
        </div>
      )
    }

    render(<Component />)
    expect(screen.getByText('Test')).toHaveStyle({ overflow: 'hidden' })
  })
})
