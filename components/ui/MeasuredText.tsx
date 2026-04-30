/**
 * Caption component with Pretext measurement
 * Prevents layout shift and ensures text fits without overflow
 */

'use client'

import { ReactNode } from 'react'
import { useTextHeight } from '@/lib/hooks/usePretext'

interface MeasuredTextProps {
  text: string
  font?: string
  maxWidth?: number
  lineHeight?: number
  children?: (height: number | null) => ReactNode
  className?: string
}

/**
 * Renders text with precomputed height to prevent layout shift
 * Great for dynamic content, image captions, and descriptions
 */
export function MeasuredText({
  text,
  font = '0.875rem monospace',
  maxWidth = 400,
  lineHeight = 20,
  children,
  className = '',
}: MeasuredTextProps) {
  const height = useTextHeight(text, font, maxWidth, lineHeight)

  if (children) {
    return children(height)
  }

  return (
    <div
      className={className}
      style={height ? { minHeight: `${height}px` } : undefined}
    >
      {text}
    </div>
  )
}

export default MeasuredText
