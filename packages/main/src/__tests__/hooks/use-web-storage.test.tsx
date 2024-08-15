import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { useWebStorage } from 'lib/ts/hooks/use-web-storage'

describe('useWebStorage', () => {
  beforeEach(() => {
    window.localStorage.clear()
    window.sessionStorage.clear()
  })

  it('should render initial state and set it to storage on mount', () => {
    const Component = () => {
      const { state } = useWebStorage({
        storageKey: 'test',
        initialState: { test: 'testStorage' }
      })

      return <h1>{state?.test}</h1>
    }

    render(<Component />)

    expect(screen.getByText('testStorage')).toBeInTheDocument()
    expect(window.localStorage.getItem('test')).toBe('{"test":"testStorage"}')
  })

  it('should read from storage and render the state without providing an initial state', async () => {
    window.localStorage.setItem('test', JSON.stringify({ test: 'testStorage' }))

    const Component = () => {
      const { state } = useWebStorage<{ test: string }>({
        storageKey: 'test'
      })

      return <h1>{state?.test}</h1>
    }

    render(<Component />)

    expect(screen.getByText('testStorage')).toBeInTheDocument()
  })

  it('should write to storage and update the state with the new given value', async () => {
    const Component = () => {
      const { state, setItemValue } = useWebStorage({
        storageKey: 'test',
        initialState: { test: 'testStorage' }
      })

      return (
        <div>
          <h1>{state?.test}</h1>
          <button
            type='button'
            onClick={() => {
              setItemValue({ test: 'newValue' })
            }}
          >
            Update storage with new value
          </button>
        </div>
      )
    }

    render(<Component />)

    await userEvent.click(
      screen.getByRole('button', { name: 'Update storage with new value' })
    )
    expect(await screen.findByText('newValue')).toBeInTheDocument()
    expect(window.localStorage.getItem('test')).toBe('{"test":"newValue"}')
  })

  it("should support setting the storage's new value by passing a function as argument to setItemValue", async () => {
    const Component = () => {
      const { state, setItemValue } = useWebStorage({
        storageKey: 'test',
        initialState: { test: 'testStorage' }
      })

      return (
        <div>
          <h1>{state?.test}</h1>
          <button
            type='button'
            onClick={() => {
              setItemValue(({ test }: { test: string }) => ({ test: `${test}-newValue` }))
            }}
          >
            Update storage with new value
          </button>
        </div>
      )
    }

    render(<Component />)

    await userEvent.click(
      screen.getByRole('button', { name: 'Update storage with new value' })
    )
    expect(screen.getByText('testStorage-newValue')).toBeInTheDocument()
    expect(window.localStorage.getItem('test')).toBe('{"test":"testStorage-newValue"}')
  })

  it('should remove an item from storage', async () => {
    const Component = () => {
      const { state, removeItem } = useWebStorage({
        storageKey: 'test',
        initialState: { test: 'testStorage' }
      })

      return (
        <div>
          <h1>{state?.test ?? 'Removed'}</h1>
          <button
            type='button'
            onClick={() => {
              removeItem()
            }}
          >
            Remove item
          </button>
        </div>
      )
    }

    render(<Component />)

    await userEvent.click(screen.getByRole('button', { name: 'Remove item' }))
    expect(screen.getByText('Removed')).toBeInTheDocument()
  })

  it('setItemValue should throw if a function is passed as argument when storage is empty AND no initial state is provided', async () => {
    const Component = () => {
      const [error, setError] = useState({ errorType: '', message: '' })
      const { setItemValue } = useWebStorage<string>({
        storageKey: 'test'
      })

      return (
        <div>
          <h1>{error.errorType}</h1>
          <p>{error.message}</p>
          <button
            type='button'
            onClick={() => {
              try {
                setItemValue((whatever: string) => `${whatever}-newValue`)
              } catch (error) {
                if (!(error instanceof Error)) return
                setError({
                  errorType: error.name,
                  message: 'Ups'
                })
              }
            }}
          >
            Update storage with new value
          </button>
        </div>
      )
    }

    render(<Component />)

    await userEvent.click(
      screen.getByRole('button', { name: 'Update storage with new value' })
    )
    expect(screen.getByText('TypeError')).toBeInTheDocument()
    expect(screen.getByText('Ups')).toBeInTheDocument()
  })
})
