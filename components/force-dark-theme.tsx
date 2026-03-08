'use client'

import { useTheme } from 'next-themes'
import { useEffect } from 'react'

export function ForceDarkTheme() {
  const { setTheme, theme } = useTheme()

  useEffect(() => {
    // Only force if not already dark
    if (theme !== 'dark') {
      setTheme('dark')
    }
  }, [setTheme, theme])

  return null
}
