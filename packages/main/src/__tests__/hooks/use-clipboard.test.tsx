import { render, screen, waitForElementToBeRemoved } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useClipboard } from 'lib/ts/hooks/use-clipboard'

describe('useClipboard', () => {
  it('should copy text to clipboard', async () => {
    const clipboardSpy = vi.spyOn(window.navigator.clipboard, 'writeText')

    const Component = () => {
      const { copied, copyToClipboard } = useClipboard()

      return (
        <div>
          <button
            type='button'
            onClick={() => {
              copyToClipboard('test')
            }}
          >
            Copy to clipboard
          </button>
          <h1>{copied ? 'Copied' : 'Copy'}</h1>
        </div>
      )
    }

    render(<Component />)

    const button = screen.getByRole('button', {
      name: 'Copy to clipboard'
    })

    expect(screen.getByRole('heading', { name: 'Copy' })).toBeInTheDocument()
    await userEvent.click(button)
    expect(clipboardSpy).toHaveBeenCalledOnce()
    expect(clipboardSpy).toHaveBeenCalledWith('test')
    waitForElementToBeRemoved(() => screen.queryByRole('heading', { name: 'Copied' }))
    clipboardSpy.mockRestore()
  })
})
