import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { usePrevious } from 'lib/ts/hooks/use-previous'

describe('usePrevious', () => {
  it('should render previous provided value', async () => {
    const Component = () => {
      const [value, setValue] = useState('oldValue')
      const { previousValue } = usePrevious({ value })

      return (
        <>
          <h1>{previousValue ?? 'No previous value'}</h1>
          <button type='button' onClick={() => setValue('newValue')}>
            Update value
          </button>
        </>
      )
    }

    render(<Component />)

    expect(screen.getByText('No previous value')).toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: 'Update value' }))
    expect(screen.getByText('oldValue')).toBeInTheDocument()
  })

  it('should render a list of all previous values', async () => {
    const Component = () => {
      const [value, setValue] = useState(0)
      const { allPreviousValues } = usePrevious({ value })

      return (
        <>
          <button type='button' onClick={() => setValue((prev) => prev + 1)}>
            Increment count
          </button>
          {allPreviousValues.length > 0 ? (
            <ul>
              {allPreviousValues.map(([key, value]) => (
                <li key={key}>{value}</li>
              ))}
            </ul>
          ) : (
            <p>No previous values</p>
          )}
        </>
      )
    }

    render(<Component />)

    expect(screen.getByText('No previous values')).toBeInTheDocument()

    await userEvent.click(screen.getByRole('button', { name: 'Increment count' }))
    await userEvent.click(screen.getByRole('button', { name: 'Increment count' }))

    expect(screen.getByText(0)).toBeInTheDocument()
    expect(screen.getByText(1)).toBeInTheDocument()
  })

  it('should support passing an entry key formatter', async () => {
    const Component = () => {
      const [value, setValue] = useState(0)
      const { allPreviousValues } = usePrevious({
        value,
        entriesKeysFormatter: (v) => {
          const rerenderNumber = v > 0 ? v + 1 : 1
          return `re-render #${rerenderNumber}`
        }
      })

      return (
        <>
          <button type='button' onClick={() => setValue((prev) => prev + 1)}>
            Increment count
          </button>
          <ul>
            {allPreviousValues.map(([key]) => (
              <li key={key}>{key}</li>
            ))}
          </ul>
        </>
      )
    }

    render(<Component />)

    await userEvent.click(screen.getByRole('button', { name: 'Increment count' }))
    await userEvent.click(screen.getByRole('button', { name: 'Increment count' }))
    expect(screen.getByText('re-render #1')).toBeInTheDocument()
    expect(screen.getByText('re-render #2')).toBeInTheDocument()
  })

  it('should support enabling a console debugger by passing a debug flag', async () => {
    const consoleInfoSpy = vi.spyOn(console, 'info')

    const Component = () => {
      const [value, setValue] = useState(0)
      const { allPreviousValues } = usePrevious({
        value,
        entriesKeysFormatter: (v) => {
          const rerenderNumber = v > 0 ? v + 1 : 1
          return `re-render #${rerenderNumber}`
        },
        debug: true
      })

      return (
        <>
          <button type='button' onClick={() => setValue((prev) => prev + 1)}>
            Increment count
          </button>
          <ul>
            {allPreviousValues.map(([key]) => (
              <li key={key}>{key}</li>
            ))}
          </ul>
        </>
      )
    }

    render(<Component />)

    expect(consoleInfoSpy).toHaveBeenCalledOnce()
    expect(consoleInfoSpy).toHaveBeenCalledWith(
      '[usePreviousValue DEBUG]: No previous values'
    )

    await userEvent.click(screen.getByRole('button', { name: 'Increment count' }))

    expect(consoleInfoSpy).toHaveBeenCalledWith('Entry key: re-render #1, Value: 0')
    vi.restoreAllMocks()
  })
})
