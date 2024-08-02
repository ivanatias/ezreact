import { render, within, screen } from '@testing-library/react'
import { usePortal, PORTAL_CONTAINER_TEST_ID } from '../../lib/ts/hooks/use-portal'

describe('usePortal', () => {
  it('should render a portal container and an element inside it', () => {
    const PortalContent = () => <h1>Test</h1>

    const Parent = () => {
      const { renderPortal } = usePortal()
      return renderPortal(<PortalContent />)
    }

    render(<Parent />)

    expect(
      within(screen.getByTestId(PORTAL_CONTAINER_TEST_ID)).getByText('Test')
    ).toBeInTheDocument()
  })
})
