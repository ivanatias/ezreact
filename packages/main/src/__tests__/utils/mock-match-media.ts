export const listeners = [] as ((event: MediaQueryListEvent) => void)[]

export function mockMatchMedia(mediaQuery: string, toCompareQuery: string) {
  return {
    matches: mediaQuery === toCompareQuery,
    addEventListener: (
      type: 'change',
      listener: (event: MediaQueryListEvent) => void
    ) => {
      if (type !== 'change') return
      listeners.push(listener)
    },
    removeEventListener: (
      type: 'change',
      listener: (event: MediaQueryListEvent) => void
    ) => {
      if (type !== 'change') return
      listeners.splice(listeners.indexOf(listener), 1)
    }
  } as unknown as MediaQueryList
}
