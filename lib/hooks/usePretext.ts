/**
 * React hooks for Pretext text measurement
 * Use these to prevent layout shifts and optimize text rendering
 */

import { useEffect, useState, useCallback } from 'react'
import { getTextHeight, truncateText, createTextCache, getTextLines } from '@/lib/utils/pretext'

/**
 * Hook to measure text height without DOM reflow
 * Prevents layout shift when dynamic content loads
 */
export function useTextHeight(
  text: string,
  font: string,
  maxWidth: number,
  lineHeight: number = 24
) {
  const [height, setHeight] = useState<number | null>(null)

  useEffect(() => {
    if (!text || !maxWidth) return

    try {
      const { height: measured } = getTextHeight(text, font, maxWidth, lineHeight)
      setHeight(measured)
    } catch (error) {
      console.error('[v0] Pretext measurement error:', error)
      setHeight(null)
    }
  }, [text, font, maxWidth, lineHeight])

  return height
}

/**
 * Hook to get wrapped text lines
 * Useful for canvas rendering or precise layout
 */
export function useTextLines(
  text: string,
  font: string,
  maxWidth: number,
  lineHeight: number = 24
) {
  const [lines, setLines] = useState<any[] | null>(null)

  useEffect(() => {
    if (!text || !maxWidth) return

    try {
      const result = getTextLines(text, font, maxWidth, lineHeight)
      setLines(result.lines || [])
    } catch (error) {
      console.error('[v0] Pretext layout error:', error)
      setLines(null)
    }
  }, [text, font, maxWidth, lineHeight])

  return lines
}

/**
 * Hook to truncate text to fit within constraints
 * Avoids layout shift when truncating dynamic content
 */
export function useTruncatedText(
  text: string,
  font: string,
  maxWidth: number,
  suffix: string = '...'
) {
  const [result, setResult] = useState<{
    displayText: string
    isTruncated: boolean
    width: number
  } | null>(null)

  useEffect(() => {
    if (!text || !maxWidth) return

    try {
      const truncated = truncateText(text, font, maxWidth, suffix)
      setResult(truncated)
    } catch (error) {
      console.error('[v0] Pretext truncate error:', error)
      setResult(null)
    }
  }, [text, font, maxWidth, suffix])

  return result
}

/**
 * Hook for text cache management
 * Memoizes prepared text for performance
 */
export function useTextCache() {
  const [cache] = useState(() => createTextCache())

  useEffect(() => {
    return () => cache.clear()
  }, [cache])

  return {
    measure: useCallback(
      (text: string, font: string, maxWidth: number, lineHeight?: number) =>
        cache.measure(text, font, maxWidth, lineHeight),
      [cache]
    ),
  }
}

export default {
  useTextHeight,
  useTextLines,
  useTruncatedText,
  useTextCache,
}
