# Pretext Integration Guide - O.W.P.I.L

## Overview

Pretext is a powerful text measurement library that prevents DOM reflows and layout shifts. It measures text using canvas, avoiding expensive `getBoundingClientRect()` calls that trigger browser reflows.

**Why use Pretext in O.W.P.I.L?**
- **No Layout Shift**: Pre-compute text heights to prevent jumping when content loads
- **Performance**: Pure JavaScript calculations instead of DOM measurements
- **Accuracy**: Browser-native font rendering ensures pixel-perfect measurements
- **Mobile Friendly**: Critical for responsive text layout on small screens

## Setup

Pretext is already added to `package.json`:
```json
"@chenglou/pretext": "^0.8.3"
```

## Core Files

### 1. `/lib/utils/pretext.ts` - Utility Functions
Low-level functions for text measurement:
- `getTextHeight()` - Measure text height without DOM
- `getTextLines()` - Get wrapped lines with positioning
- `findOptimalWidth()` - Find ideal container width (shrink-wrap)
- `truncateText()` - Truncate text to fit width
- `createTextCache()` - Cache prepared text for performance

### 2. `/lib/hooks/usePretext.ts` - React Hooks
React-friendly hooks for components:
- `useTextHeight()` - Hook to measure text height
- `useTextLines()` - Hook to get wrapped lines
- `useTruncatedText()` - Hook to truncate text
- `useTextCache()` - Hook for text caching

### 3. `/components/ui/MeasuredText.tsx` - Reusable Component
Pre-built component for text measurement:
```tsx
<MeasuredText
  text="Your text here"
  font="1rem serif"
  maxWidth={400}
  lineHeight={24}
  className="my-text"
/>
```

## Usage Examples

### Example 1: Dashboard Chat Messages (Implemented)
Prevent layout shift when AI responses render:

```tsx
import { useTextHeight } from '@/lib/hooks/usePretext'

export function ChatMessage({ message }) {
  const height = useTextHeight(
    message.content,
    '0.875rem monospace',
    640,
    24
  )

  return (
    <div style={height ? { minHeight: `${height}px` } : undefined}>
      {message.content}
    </div>
  )
}
```

**Benefit**: Messages don't jump around when loading; the container reserves space upfront.

### Example 2: Gallery Captions (Implemented)
Ensure captions don't overflow their containers:

```tsx
import { useTextHeight } from '@/lib/hooks/usePretext'

export function GalleryCaption({ alt }) {
  const captionHeight = useTextHeight(
    alt,
    '1rem serif',
    400,
    24
  )

  return (
    <div style={captionHeight ? { minHeight: `${captionHeight}px` } : undefined}>
      <p>{alt}</p>
    </div>
  )
}
```

**Benefit**: Captions always fit their space; prevents text overflow bugs.

### Example 3: Timeline Descriptions
Measure timeline item descriptions to prevent wrapping issues:

```tsx
import { getTextHeight } from '@/lib/utils/pretext'

// In a component or calculation
const descHeight = getTextHeight(
  "The Foundation",
  "1.5rem serif",
  500,
  28
)
```

### Example 4: Responsive Text Sizing
Find optimal width for balanced text layout:

```tsx
import { findOptimalWidth } from '@/lib/utils/pretext'

// Find width that produces exactly 2 lines
const optimalWidth = findOptimalWidth(
  longText,
  "1rem sans-serif",
  2, // target 2 lines
  200, // min width
  800  // max width
)
```

**Benefit**: Text looks balanced and intentional, not broken by chance.

### Example 5: Text Truncation
Truncate dynamic text to fit without DOM measurement:

```tsx
import { useTruncatedText } from '@/lib/hooks/usePretext'

export function Truncator({ text }) {
  const result = useTruncatedText(
    text,
    "1rem sans-serif",
    300, // max width
    "..." // suffix
  )

  return (
    <p>
      {result?.displayText}
      {result?.isTruncated && " more"}
    </p>
  )
}
```

## Font Format

Pretext uses canvas font syntax (same as `ctx.font`):
```
[style] [weight] [size] [family]
```

Examples:
```
"16px Inter"           // base sans-serif
"bold 18px -apple-system" // bold system font
"italic 1rem serif"    // italic serif
"700 1.5rem Helvetica" // bold serif
```

**Must match your CSS**: If your CSS says `font-size: 16px`, your font string must have `16px` (or `1rem` if computed to 16px).

## Common Font Strings for O.W.P.I.L

```tsx
export const FONTS = {
  serifLarge: '1.5rem serif',     // headings
  serifBase: '1rem serif',         // body text
  sansBase: '1rem sans-serif',    // default
  monoSmall: '0.875rem monospace', // code/mono
}
```

Add more as needed in `/lib/utils/pretext.ts`.

## Performance Tips

1. **Cache Prepared Text**: Use `createTextCache()` for repeated text
   ```tsx
   const cache = createTextCache()
   cache.measure(text1, font, 400)
   cache.measure(text2, font, 400) // reuses cache
   ```

2. **Measure Once**: Don't re-measure the same text
   ```tsx
   // ✅ Good - measures once
   const height = useTextHeight(text, font, width, lineHeight)
   
   // ❌ Bad - measures on every render
   const height = getTextHeight(text, font, width, lineHeight)
   ```

3. **Clear Cache on Language Change**: When user switches language
   ```tsx
   import { clearCache } from '@chenglou/pretext'
   
   // After language change
   clearCache()
   ```

4. **Mobile Widths**: Account for viewport width
   ```tsx
   const maxWidth = Math.min(
     600,
     typeof window !== 'undefined' ? window.innerWidth - 32 : 600
   )
   ```

## Already Integrated

- ✅ **Dashboard Chat** (`/app/dashboard/page.tsx`) - Messages with Pretext height
- ✅ **Gallery Lightbox** (`/components/sections/GallerySection.tsx`) - Captions measured

## Where to Add Next

1. **TimelineSection** - Measure description text to prevent overflow
2. **ConnectSection** - Newsletter form text truncation
3. **PhilosophySection** - Philosophy item descriptions
4. **Merch Page** - Product descriptions and truncation
5. **Documentary Page** - Form text and captions

## Testing

To verify Pretext is working:

```tsx
// Enable console logging
import { getTextHeight } from '@/lib/utils/pretext'

const height = getTextHeight(
  "Test text",
  "1rem sans-serif",
  400,
  24
)
console.log('[v0] Text height:', height) // should log a number
```

## Troubleshooting

**Problem**: Text still overflows
- **Solution**: Check font string matches CSS exactly
- Verify `maxWidth` is correct for your container

**Problem**: Height seems wrong
- **Solution**: Ensure `lineHeight` matches CSS `line-height`
- Use canvas font syntax with size (e.g., `"16px Inter"`, not `"Inter"`)

**Problem**: Performance issues
- **Solution**: Use `useTextCache()` for repeated measurements
- Don't re-measure the same text multiple times per render

## References

- **Pretext Docs**: https://github.com/chenglou/pretext/blob/main/README.md
- **Canvas Font Syntax**: https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/font
- **Browser Reflow**: https://developer.mozilla.org/en-US/docs/Glossary/Reflow
