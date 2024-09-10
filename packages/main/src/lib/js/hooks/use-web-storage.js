import { useSyncExternalStore, useEffect, useCallback, useRef } from 'react'

const subscribe = (callback) => {
  const listener = (event) => {
    callback(event.newValue)
  }
  window.addEventListener('storage', listener)

  return () => {
    window.removeEventListener('storage', listener)
  }
}

const getStorageValue = ({ storageKey, storage }) => {
  return window[storage].getItem(storageKey)
}

const setValueToStorage = ({ storageKey, storage, value }) => {
  const stringyfiedValue = JSON.stringify(value)
  window[storage].setItem(storageKey, stringyfiedValue)

  window.dispatchEvent(
    new StorageEvent('storage', { key: storageKey, newValue: stringyfiedValue })
  )
}

const removeValueFromStorage = ({ storageKey, storage }) => {
  window[storage].removeItem(storageKey)
  window.dispatchEvent(new StorageEvent('storage', { key: storageKey }))
}

const valueIsFunction = (value) => typeof value === 'function'

export function useWebStorage({ storageKey, initialState, storage = 'localStorage' }) {
  const store = useSyncExternalStore(
    subscribe,
    () => getStorageValue({ storageKey, storage }),
    () => JSON.stringify(initialState ?? null)
  )
  const storeRef = useRef(store)
  const initialStateRef = useRef(initialState)
  const isFirstRender = useRef(true)

  useEffect(() => {
    if (
      getStorageValue({ storageKey, storage }) === null &&
      initialStateRef.current !== undefined &&
      isFirstRender.current
    ) {
      setValueToStorage({ storageKey, storage, value: initialStateRef.current })
    }
    isFirstRender.current = false
  }, [storageKey, storage])

  useEffect(() => {
    storeRef.current = store
  }, [store])

  const setItemValue = useCallback(
    (value) => {
      if (value == null) {
        throw new TypeError(
          `Cannot set the following storage key's value to null or undefined: ${storageKey}.
           If you want to remove the item from storage, use the removeItem method instead`
        )
      }

      let newValue = null

      if (valueIsFunction(value)) {
        if (storeRef.current === null && initialStateRef.current === undefined) {
          throw new TypeError(
            `Cannot call ${value.name} as the store's value is null and no initial state was provided`
          )
        }
        newValue =
          storeRef.current !== null
            ? value(JSON.parse(storeRef.current))
            : value(initialStateRef.current)
      } else {
        newValue = value
      }

      setValueToStorage({ storageKey, storage, value: newValue })
    },
    [storage, storageKey]
  )

  const removeItem = useCallback(() => {
    removeValueFromStorage({ storageKey, storage })
  }, [storage, storageKey])

  return {
    state: JSON.parse(store ?? 'null'),
    setItemValue,
    removeItem
  }
}
