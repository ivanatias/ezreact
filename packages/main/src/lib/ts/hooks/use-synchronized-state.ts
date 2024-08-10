import { useState, useEffect, useRef, useCallback } from 'react'

type UseSynchronizedStateOptions<StateType> = {
  key: string
  initialState?: StateType | (() => StateType)
  track?: StateType
}

export function useSynchronizedState<StateType>({
  initialState,
  key,
  track
}: UseSynchronizedStateOptions<StateType>) {
  const [state, setState] = useState<StateType | undefined>(initialState)
  const emitterChannelRef = useRef<BroadcastChannel | null>(null)
  const receiverChannelRef = useRef<BroadcastChannel | null>(null)
  const lastTrackedState = useRef<StateType | undefined>(undefined)

  const broadcast = useCallback((message: StateType) => {
    if (emitterChannelRef.current === null) return
    emitterChannelRef.current.postMessage(message)
    lastTrackedState.current = message
  }, [])

  useEffect(() => {
    if (emitterChannelRef.current === null && receiverChannelRef.current === null) {
      emitterChannelRef.current = new BroadcastChannel(key)
      receiverChannelRef.current = new BroadcastChannel(key)
    }

    const onMessage = (event: MessageEvent<StateType>) => {
      setState(event.data)
    }

    const onMessageError = () => {
      console.error(`Error receiving message on channel with key: ${key}`)
    }

    receiverChannelRef.current?.addEventListener('message', onMessage)
    receiverChannelRef.current?.addEventListener('messageerror', onMessageError)

    return () => {
      receiverChannelRef.current?.removeEventListener('message', onMessage)
      receiverChannelRef.current?.removeEventListener('messageerror', onMessageError)
    }
  }, [key])

  useEffect(() => {
    if (
      JSON.stringify(track) === JSON.stringify(lastTrackedState.current) ||
      track === undefined
    ) {
      return
    }
    broadcast(track)
  }, [track, broadcast])

  useEffect(() => {
    return () => {
      if (receiverChannelRef.current !== null && emitterChannelRef.current !== null) {
        emitterChannelRef.current.close()
        receiverChannelRef.current.close()
        emitterChannelRef.current = null
        receiverChannelRef.current = null
      }
    }
  }, [])

  return { state, broadcast }
}
