import { render, screen, waitForElementToBeRemoved } from '@testing-library/react'
import { useExternalScript } from 'lib/ts/hooks/use-external-script'

describe('useExternalScript', () => {
  it('should load and execute an external script', async () => {
    // Silence log from external script
    vi.spyOn(console, 'log').mockImplementation(() => {})

    const Component = () => {
      const { loading, error } = useExternalScript(
        'https://unpkg.com/hello-world-test-for-npm@1.0.1/index.js'
      )

      return <h1>{loading ? 'Loading script' : error ? 'Error' : 'Script loaded'}</h1>
    }

    const { baseElement } = render(<Component />)

    await waitForElementToBeRemoved(() => screen.queryByText('Loading script'))
    expect(screen.getByText('Script loaded')).toBeInTheDocument()

    const script = baseElement.querySelector('script')

    expect(script).toBeInTheDocument()
    expect(script).toHaveAttribute(
      'src',
      'https://unpkg.com/hello-world-test-for-npm@1.0.1/index.js'
    )
    expect(script).toHaveAttribute('async', 'true')

    vi.restoreAllMocks()
  })
})
