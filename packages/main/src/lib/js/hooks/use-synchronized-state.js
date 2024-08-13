import { useState, useEffect, useRef, useCallback } from 'react'

export function useSynchronizedState({ initialState, key, track }) {
  const [state, setState] = useState(initialState)
  const emitterChannelRef = useRef(null)
  const receiverChannelRef = useRef(null)
  const lastTrackedState = useRef(undefined)
  const isFirstRender = useRef(true)

  if (lastTrackedState.current === undefined && isFirstRender.current) {
    lastTrackedState.current =
      typeof initialState === 'function' ? initialState() : initialState
  }

  const broadcast = useCallback((message) => {
    if (
      emitterChannelRef.current !== null &&
      JSON.stringify(message) !== JSON.stringify(lastTrackedState.current)
    ) {
      lastTrackedState.current = message
      emitterChannelRef.current.postMessage(message)
    }
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

    isFirstRender.current = false

    return () => {
      receiverChannelRef.current?.removeEventListener('message', onMessage)
      receiverChannelRef.current?.removeEventListener('messageerror', onMessageError)
    }
  }, [key])

  useEffect(() => {
    if (track === undefined) return
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
