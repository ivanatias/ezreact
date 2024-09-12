import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { useMatchMedia } from '@/lib/ts/hooks/use-match-media'
import { listeners, mockMatchMedia } from '../utils/mock-match-media'

describe('useMatchMedia', () => {
  beforeEach(() => {
    vi.spyOn(window, 'matchMedia').mockImplementation((query) =>
      mockMatchMedia(query, '(min-width: 640px)')
    )
  })

  afterEach(() => {
    vi.restoreAllMocks()
    listeners.length = 0
  })

  // This test case should be improved
  // TODO: find a way to test if the provided callback
  // is fired whenever window's width changes
  it('should fire passed callback on match media change event', async () => {
    const Component = () => {
      const [matches, setMatches] = useState(false)
      const [mediaQuery, setMediaQuery] = useState('(max-width: 360px)')
      useMatchMedia(mediaQuery, (matches) => setMatches(matches))

      return (
        <div>
          <h1>{matches ? 'It matches!' : 'Does not match'}</h1>
          <button
            type='button'
            onClick={() => {
              setMediaQuery('(min-width: 640px)')
            }}
          >
            Make it match
          </button>
        </div>
      )
    }

    render(<Component />)

    expect(screen.getByText('Does not match')).toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: 'Make it match' }))
    expect(screen.getByText('It matches!')).toBeInTheDocument()
  })
})
