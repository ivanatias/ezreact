import { useState, useEffect, useRef, useCallback } from 'react'

export function useSynchronizedState({ initialState, key, track }) {
  const [state, setState] = useState(() => initialState)
  const emitterChannelRef = useRef(null)
  const receiverChannelRef = useRef(null)
  const lastTrackedState = useRef(undefined)

  const broadcast = useCallback((message) => {
    if (emitterChannelRef.current === null) return
    emitterChannelRef.current.postMessage(message)
    lastTrackedState.current = message
  }, [])

  useEffect(() => {
    if (emitterChannelRef.current === null && receiverChannelRef.current === null) {
      emitterChannelRef.current = new BroadcastChannel(key)
      receiverChannelRef.current = new BroadcastChannel(key)
    }

    const onMessage = (event) => {
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
