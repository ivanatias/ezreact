import { useState, useEffect, useMemo } from 'react'

export function usePrevious({
  value,
  entriesKeysFormatter = () => Date.now(),
  debug = false
}) {
  const [currentValue, setCurrentValue] = useState(value)
  const [previousValue, setPreviousValue] = useState(undefined)
  const [allPreviousValues, setAllPreviousValues] = useState(() => new Map())

  if (currentValue !== value) {
    setPreviousValue(currentValue)
    setAllPreviousValues((prev) => {
      const newMap = new Map(prev)
      const entryKey = entriesKeysFormatter(currentValue)
      newMap.set(entryKey, currentValue)
      return newMap
    })
    setCurrentValue(value)
  }

  useEffect(() => {
    if (!debug) return
    if (allPreviousValues.size === 0) {
      console.info('[usePrevious DEBUG]: No previous values')
      return
    }

    console.log('[usePrevious DEBUG]:')

    for (const [key, value] of allPreviousValues) {
      console.info(`Entry key: ${key}, Value: ${value}`)
    }

    console.log('_________________')
  }, [allPreviousValues, debug])

  return {
    previousValue,
    allPreviousValues: useMemo(
      () => Array.from(allPreviousValues.entries()),
      [allPreviousValues]
    )
  }
}
