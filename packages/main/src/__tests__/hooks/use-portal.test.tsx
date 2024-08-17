import { render, within } from '@testing-library/react'
import { usePortal } from 'lib/ts/hooks/use-portal'

describe('usePortal', () => {
  it('should render a portal container and an element inside it', () => {
    const PortalContent = () => <h1>Test</h1>

    const Parent = () => {
      const { renderPortal } = usePortal()
      return renderPortal(<PortalContent />)
    }

    const { baseElement } = render(<Parent />)

    // Since the portal container is the only node with child elements
    // we can use this to find it
    const [portalContainer] = Array.from(baseElement.querySelectorAll('div')).filter(
      ($el) => $el.childElementCount > 0
    )

    expect(within(portalContainer).getByText('Test')).toBeInTheDocument()
  })
})
