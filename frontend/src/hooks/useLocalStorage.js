import { useEffect, useState, useRef } from 'react'

export function useLocalStorage(key, initialValue) {
  const isFirstRun = useRef(true)
  const [state, setState] = useState(() => {
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch {
      return initialValue
    }
  })

  useEffect(() => {
    // Skip writing on the initial mount if localStorage had the value already
    if (isFirstRun.current) {
      isFirstRun.current = false
      return
    }
    try {
      window.localStorage.setItem(key, JSON.stringify(state))
    } catch {
      // ignore quota or serialization errors
    }
  }, [key, state])

  return [state, setState]
}
