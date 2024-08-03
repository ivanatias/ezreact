import { useState, useCallback } from 'react'

export function useClipboard(resetCopyAfterMs = 300) {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = useCallback(
    async (text) => {
      try {
        await navigator.clipboard.writeText(text)
        setCopied(true)
        setTimeout(() => {
          setCopied(false)
        }, resetCopyAfterMs)
      } catch {
        console.error('Failed to copy text to clipboard')
      }
    },
    [resetCopyAfterMs]
  )

  return { copied, copyToClipboard }
}
