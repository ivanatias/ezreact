import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { useSynchronizedState } from '@/lib/ts/hooks/use-synchronized-state'
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
})
