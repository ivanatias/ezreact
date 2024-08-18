import { useSyncExternalStore } from 'react'

const emptySubscribe = () => () => {}

export function useIsClient() {
  return (
    useSyncExternalStore(
      emptySubscribe,
      () => 'client',
      () => 'server'
    ) === 'client'
  )
}
