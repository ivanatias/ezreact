import { useState, useEffect } from 'react'

export function usePrevious<ValueType, PreviousValueEntryType = number>({
  value,
  entriesKeysFormatter = () => Date.now() as PreviousValueEntryType,
  debug = false
}: {
  value: ValueType
  entriesKeysFormatter?: (value: ValueType) => PreviousValueEntryType
  debug?: boolean
}) {
  const [currentValue, setCurrentValue] = useState(value)
  const [previousValue, setPreviousValue] = useState<ValueType | undefined>(undefined)
  const [allPreviousValues, setAllPreviousValues] = useState<
    Map<PreviousValueEntryType, ValueType>
  >(() => new Map())

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
      console.info('[usePreviousValue DEBUG]: No previous values')
      return
    }

    console.log('[usePreviousValue DEBUG]:')

    for (const [key, value] of allPreviousValues) {
      console.info(`Entry key: ${key}, Value: ${value}`)
    }

    console.log('_________________')
  }, [allPreviousValues, debug])

  return { previousValue, allPreviousValues: Array.from(allPreviousValues.entries()) }
}
