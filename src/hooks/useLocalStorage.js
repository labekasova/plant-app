import { useState } from 'react'

export function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const savedValue = window.localStorage.getItem(key)
      return savedValue === null ? initialValue : JSON.parse(savedValue)
    } catch {
      return initialValue
    }
  })

  const setValue = (nextValue) => {
    setStoredValue((currentValue) => {
      const value =
        typeof nextValue === 'function' ? nextValue(currentValue) : nextValue

      try {
        window.localStorage.setItem(key, JSON.stringify(value))
      } catch {
        // The UI still works when storage is unavailable (for example, private mode).
      }

      return value
    })
  }

  return [storedValue, setValue]
}
