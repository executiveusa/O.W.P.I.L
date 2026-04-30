/**
 * Pretext utilities for accurate text measurement and layout
 * without triggering DOM reflows or layout shifts
 */

import { prepare, layout, prepareWithSegments, layoutWithLines } from '@chenglou/pretext'

/**
 * Common font configurations used in O.W.P.I.L
 */
export const FONTS = {
  serifLarge: '2xl serif' as const,    // 24px
  serifBase: '1rem serif' as const,     // 16px
  sansBase: '1rem sans-serif' as const, // 16px
  monoSmall: '0.875rem monospace' as const, // 14px
} as const

/**
 * Calculate text height without DOM measurement
 * Perfect for preventing layout shift when content loads
 */
export function getTextHeight(
  text: string,
  font: string,
  maxWidth: number,
  lineHeight: number = 24
): { height: number; lineCount: number } {
  const prepared = prepare(text, font, { whiteSpace: 'normal' })
  return layout(prepared, maxWidth, lineHeight)
}

/**
 * Get wrapped lines for text with custom font
 * Useful for canvas rendering or precise line layout
 */
export function getTextLines(
  text: string,
  font: string,
  maxWidth: number,
  lineHeight: number = 24
) {
  const prepared = prepareWithSegments(text, font)
  return layoutWithLines(prepared, maxWidth, lineHeight)
}

/**
 * Find optimal container width for text (shrink-wrap)
 * Helps achieve balanced text layout without CSS hacks
 */
export function findOptimalWidth(
  text: string,
  font: string,
  targetLines: number,
  minWidth: number = 200,
  maxWidth: number = 800
): number {
  const prepared = prepareWithSegments(text, font)
  
  let low = minWidth
  let high = maxWidth
  let bestWidth = maxWidth
  
  while (low <= high) {
    const mid = Math.floor((low + high) / 2)
    const { lineCount } = layout(prepare(text, font), mid, 24)
    
    if (lineCount === targetLines) {
      return mid
    }
    
    if (lineCount > targetLines) {
      low = mid + 1
    } else {
      bestWidth = mid
      high = mid - 1
    }
  }
  
  return bestWidth
}

/**
 * Truncate text to fit within width without DOM measurement
 * Returns { displayText, isTruncated, width }
 */
export function truncateText(
  text: string,
  font: string,
  maxWidth: number,
  suffix: string = '...'
): { displayText: string; isTruncated: boolean; width: number } {
  const prepared = prepare(text, font)
  const { height, lineCount } = layout(prepared, maxWidth, 24)
  
  // If it fits on one line, no truncation needed
  if (lineCount === 1) {
    const { width } = layout(prepared, maxWidth, 24)
    return { displayText: text, isTruncated: false, width }
  }
  
  // Binary search to find truncation point
  let truncated = text
  for (let i = text.length - 1; i > 0; i--) {
    const candidate = text.slice(0, i) + suffix
    const candidatePrepared = prepare(candidate, font)
    const { lineCount: lines } = layout(candidatePrepared, maxWidth, 24)
    
    if (lines === 1) {
      truncated = candidate
      break
    }
  }
  
  const truncatedPrepared = prepare(truncated, font)
  const { width } = layout(truncatedPrepared, maxWidth, 24)
  
  return {
    displayText: truncated,
    isTruncated: truncated !== text,
    width,
  }
}

/**
 * Precompute multiple text variants for performance
 * Cache prepared text to avoid recomputation
 */
export function createTextCache() {
  const cache = new Map<string, ReturnType<typeof prepare>>()
  
  return {
    prepare: (text: string, font: string) => {
      const key = `${text}|${font}`
      if (!cache.has(key)) {
        cache.set(key, prepare(text, font))
      }
      return cache.get(key)!
    },
    
    measure: (text: string, font: string, maxWidth: number, lineHeight: number = 24) => {
      const prepared = cache.get(`${text}|${font}`) || prepare(text, font)
      return layout(prepared, maxWidth, lineHeight)
    },
    
    clear: () => cache.clear(),
  }
}

export default {
  getTextHeight,
  getTextLines,
  findOptimalWidth,
  truncateText,
  createTextCache,
}
