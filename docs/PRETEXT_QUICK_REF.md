# Pretext Quick Reference

## One-Liner Solutions

### Measure text height (prevent layout shift)
```tsx
const height = useTextHeight(text, "1rem serif", 400, 24)
```

### Get truncated text
```tsx
const { displayText, isTruncated } = useTruncatedText(text, "1rem sans", 300)
```

### Get wrapped lines
```tsx
const { lines } = getTextLines(text, "1rem mono", 400, 24)
```

### Find optimal width (shrink-wrap)
```tsx
const width = findOptimalWidth(text, "1rem serif", 3) // exactly 3 lines
```

## Common Use Cases

| Use Case | Solution | File |
|----------|----------|------|
| Chat messages won't shift | `useTextHeight()` + `minHeight` | `/lib/hooks/usePretext.ts` |
| Image captions overflow | `useTextHeight()` + container style | `/lib/hooks/usePretext.ts` |
| Truncate long text | `useTruncatedText()` | `/lib/hooks/usePretext.ts` |
| Balanced heading | `findOptimalWidth()` | `/lib/utils/pretext.ts` |
| Canvas rendering | `getTextLines()` | `/lib/utils/pretext.ts` |
| Performance caching | `useTextCache()` | `/lib/hooks/usePretext.ts` |

## Font String Cheat Sheet

```
"16px Inter"              // 16px sans-serif
"700 18px Inter"          // bold 18px sans-serif
"italic 1rem serif"       // italic 1rem serif
"0.875rem monospace"      // 14px monospace
"500 1.25rem system-ui"   // medium 20px system font
```

## Typical Flow

```tsx
import { useTextHeight } from '@/lib/hooks/usePretext'

export function MyComponent({ content }) {
  // 1. Measure the content
  const height = useTextHeight(
    content,
    "1rem sans-serif",    // font
    400,                  // max width
    24                    // line height
  )

  // 2. Reserve space with measured height
  return (
    <div style={height ? { minHeight: `${height}px` } : {}}>
      {content}
    </div>
  )
}
```

## Installation Check

```bash
# Already installed in package.json
npm ls @chenglou/pretext

# Should output: @chenglou/pretext@0.8.3
```

## When to Use

✅ **Use Pretext When:**
- Content height is dynamic (AI responses, user input, etc.)
- You want to prevent layout shift
- Text wrapping might change layout
- Image captions or descriptions
- Performance is critical

❌ **Don't Use Pretext For:**
- Static, fixed-height text
- Content inside scrollable containers (usually OK to shift)
- Simple single-line labels
- Text inside fixed-height divs

## Performance Profile

- **First measure**: ~1-2ms (includes font loading)
- **Cached measures**: <0.1ms (pure math)
- **Memory**: ~100 bytes per unique text+font combo

## Debugging

```tsx
import { getTextHeight } from '@/lib/utils/pretext'

// Test a measurement
const result = getTextHeight("Test", "16px Inter", 300, 24)
console.log('[v0] Height:', result) // { height: 48, lineCount: 2 }
```

## Integration Checklist

- [x] Added `@chenglou/pretext` to package.json
- [x] Created `/lib/utils/pretext.ts` (utilities)
- [x] Created `/lib/hooks/usePretext.ts` (React hooks)
- [x] Created `/components/ui/MeasuredText.tsx` (component)
- [x] Integrated into Dashboard chat
- [x] Integrated into Gallery captions
- [ ] Integrate into Timeline descriptions
- [ ] Integrate into Philosophy section
- [ ] Integrate into Merch page
