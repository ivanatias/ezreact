import { useState, useEffect } from 'react'

export function useExternalScript(src) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [retryValue, setRetryValue] = useState(Math.random())

  const retryScriptLoad = () => {
    setRetryValue(Math.random())
  }

  useEffect(() => {
    retryValue

    setLoading(true)
    setError(false)

    const script = document.createElement('script')
    script.setAttribute('src', src)
    script.setAttribute('async', 'true')
    document.body.appendChild(script)

    const onLoad = () => {
      setLoading(false)
      setError(false)
    }

    const onError = () => {
      setLoading(false)
      setError(true)
    }

    script.addEventListener('load', onLoad)
    script.addEventListener('error', onError)

    return () => {
      script.removeEventListener('load', onLoad)
      script.removeEventListener('error', onError)
      document.body.removeChild(script)
    }
  }, [src, retryValue])

  return { loading, error, retryScriptLoad }
}
