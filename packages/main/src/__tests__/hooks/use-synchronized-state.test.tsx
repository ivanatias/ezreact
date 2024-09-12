import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { useSynchronizedState } from 'lib/ts/hooks/use-synchronized-state'
import { MockBroadcastChannel, allListeners } from '../utils/mock-broadcast-channel'

describe('useSynchronizedState', () => {
  beforeEach(() => {
    vi.spyOn(window, 'BroadcastChannel').mockImplementation(
      () => new MockBroadcastChannel('test') as unknown as BroadcastChannel
    )
  })

  afterEach(() => {
    vi.restoreAllMocks()
    allListeners.length = 0
  })

  it('should render provided initial state', () => {
    const Tab = () => {
      const { state } = useSynchronizedState({ initialState: 'test', key: 'test' })
      return <>{state}</>
    }

    render(<Tab />)
    expect(screen.getByText('test')).toBeInTheDocument()
  })

  it('should render updated state between different tabs', async () => {
    const Tab = () => {
      const { state, broadcast } = useSynchronizedState({
        initialState: 'test',
        key: 'test'
      })

      return (
        <>
          <button
            type='button'
            onClick={() => {
              broadcast('updated')
            }}
          >
            Update
          </button>
          <h1>{state}</h1>
        </>
      )
    }

    render(
      <>
        <Tab />
        <Tab />
      </>
    )

    expect(window.BroadcastChannel).toHaveBeenCalledWith('test')
    expect(screen.getAllByRole('heading', { name: 'test' })).toHaveLength(2)
    await userEvent.click(
      screen.getAllByRole('button', { name: 'Update' }).at(0) as Element
    )
    expect(await screen.findAllByRole('heading', { name: 'updated' })).toHaveLength(2)
  })

  it('should keep track of async states updates between different tabs', async () => {
    const Tab = () => {
      const [asyncState, setAsyncState] = useState<string | undefined>(undefined)
      const { state } = useSynchronizedState({
        initialState: 'test',
        key: 'test',
        track: asyncState
      })

      return (
        <>
          <button
            type='button'
            onClick={() => {
              Promise.resolve('updated').then(setAsyncState)
            }}
          >
            Update
          </button>
          <h1>{state}</h1>
        </>
      )
    }

    render(
      <>
        <Tab />
        <Tab />
      </>
    )

    expect(window.BroadcastChannel).toHaveBeenCalledWith('test')
    expect(screen.getAllByRole('heading', { name: 'test' })).toHaveLength(2)
    await userEvent.click(
      screen.getAllByRole('button', { name: 'Update' }).at(0) as Element
    )
    expect(await screen.findAllByRole('heading', { name: 'updated' })).toHaveLength(2)
  })

  it('should not update the state if the exact same state content is provided', async () => {
    const channelSpy = vi.spyOn(MockBroadcastChannel.prototype, 'postMessage')

    const Tab = () => {
      const [asyncState, setAsyncState] = useState<{ username: string } | undefined>(
        undefined
      )
      const { state, broadcast } = useSynchronizedState({
        initialState: { username: 'johndoe' },
        key: 'test',
        track: asyncState
      })

      return (
        <>
          <button
            type='button'
            onClick={() => {
              Promise.resolve({ username: 'peter' }).then(setAsyncState)
            }}
          >
            Update async state
          </button>
          <button
            type='button'
            onClick={() => {
              broadcast({ username: 'johndoe' })
            }}
          >
            Update state
          </button>
          <h1>{state?.username}</h1>
        </>
      )
    }

    render(<Tab />)

    expect(window.BroadcastChannel).toHaveBeenCalledWith('test')
    expect(screen.getByRole('heading', { name: 'johndoe' })).toBeInTheDocument()

    await userEvent.click(screen.getByRole('button', { name: 'Update state' }))

    expect(channelSpy).not.toHaveBeenCalled()
    expect(screen.getByRole('heading', { name: 'johndoe' })).toBeInTheDocument()

    await userEvent.click(screen.getByRole('button', { name: 'Update async state' }))

    expect(await screen.findByRole('heading', { name: 'peter' })).toBeInTheDocument()

    await userEvent.click(screen.getByRole('button', { name: 'Update async state' }))

    expect(channelSpy).toHaveBeenCalledOnce()
  })

  it('should not reinitialize last tracked state reference after the first render', async () => {
    const Tab = () => {
      const { state, broadcast } = useSynchronizedState({
        initialState: 'test',
        key: 'test'
      })

      return (
        <>
          <button
            type='button'
            onClick={() => {
              broadcast('test')
            }}
          >
            Reset to initial state
          </button>
          <h1>{state ?? 'undefined'}</h1>
          <button
            type='button'
            onClick={() => {
              broadcast(undefined as unknown as string)
            }}
          >
            Make state undefined
          </button>
        </>
      )
    }

    render(<Tab />)

    expect(window.BroadcastChannel).toHaveBeenCalledWith('test')
    expect(screen.getByText('test')).toBeInTheDocument()

    await userEvent.click(screen.getByRole('button', { name: 'Make state undefined' }))
    expect(await screen.findByText('undefined')).toBeInTheDocument()

    await userEvent.click(screen.getByRole('button', { name: 'Reset to initial state' }))
    expect(await screen.findByText('test')).toBeInTheDocument()
  })
})
