# PR: Quote Correction & Image Optimization

## Summary
This PR addresses two critical issues:
1. **Quote Mismatch** - The hero section quote was incomplete compared to the philosophy section
2. **Image Sizing Issues** - Images across multiple pages needed proper centering and performance optimization

## Changes Made

### 1. Quote Fixes
**File:** `lib/i18n/translations.ts`

Updated all translation keys for `hero.tagline` to include the full, extended quote across all 5 languages:

**English (before):**
```
"One Without Purpose Is Lost"
```

**English (after):**
```
"One without purpose is lost. But to find purpose is to find oneself — and in finding oneself, we find everything."
```

**Translations updated:**
- English ✓
- Spanish ✓
- Japanese ✓
- French ✓
- Portuguese ✓

### 2. Philosophy Section Quote Sync
**File:** `components/sections/PhilosophySection.tsx`

Changed from hardcoded quote to use translation keys:
- Before: Hardcoded text with manual attribution
- After: Uses `t("hero.tagline")` and `t("hero.attribution")` for consistency

### 3. Image Optimization

#### Hero Section Images
**File:** `components/hero/HeroSection.tsx`
- Already properly optimized with `object-cover object-center`
- Quality set to 85
- Proper sizing with `w-full h-full` containers

#### Gallery Images
**File:** `components/sections/GallerySection.tsx`
- Grid images: `object-cover object-center` with responsive sizing
- Lightbox images: `object-contain object-center` with measured captions via Pretext
- Quality optimized to 80
- Proper mobile-first responsive sizing

#### Timeline Images
**File:** `components/sections/TimelineSection.tsx`
- Featured images: `object-cover object-center`
- Quality set to 80
- Responsive sizing with proper `sizes` attribute

#### Documentary Page
**File:** `app/documentary/page.tsx`
- Poster image: Fixed width/height with `w-full h-auto`
- Already properly sized

#### Dashboard Agent Page
**File:** `app/dashboard/agent/page.tsx`
- Main avatar: Added `object-center`, `flex-shrink-0`, and `loading="lazy"`
- Saved avatars: Added `object-center`, `flex-shrink-0`, and `loading="lazy"`
- Ensures images stay centered and properly sized on all screens

#### Auth Pages - Login & Signup
**File:** `app/auth/login/page.tsx` & `app/auth/sign-up/page.tsx`
- Background images: Added `decoding="async"` for non-blocking image decoding
- Images use `object-cover object-center` for proper centering
- `loading="lazy"` for performance

## Image Sizing Standards Applied

All images now follow these patterns:

### Fill Images (full container)
```tsx
<Image
  src={src}
  alt={alt}
  fill
  className="object-cover object-center"
  sizes="appropriate sizes"
  quality={80-85}
/>
```

### Fixed-Size Images
```tsx
<Image
  src={src}
  alt={alt}
  width={w}
  height={h}
  className="w-full h-auto"
  quality={80}
/>
```

### HTML Images (backgrounds, performance)
```html
<img
  src={src}
  alt={alt}
  className="w-full h-full object-cover object-center"
  loading="lazy"
  decoding="async"
/>
```

## Mobile Optimization

All changes ensure:
- ✓ Images scale properly on mobile (no oversized images)
- ✓ Images stay centered in their containers
- ✓ Proper aspect ratios maintained
- ✓ Fast loading with lazy loading & async decoding
- ✓ Reduced layout shift with proper sizing

## Testing Checklist

- [ ] Hero section displays quote correctly on all languages
- [ ] Philosophy section uses same quote as hero
- [ ] Gallery images display centered on mobile/desktop
- [ ] Timeline featured image displays properly
- [ ] Documentary poster loads correctly
- [ ] Dashboard agent avatars display centered
- [ ] Auth page background images display properly
- [ ] No layout shift when images load
- [ ] Mobile responsiveness verified across all pages

## Performance Impact

- Reduced image file sizes (quality optimized)
- Lazy loading enabled for background images
- Async image decoding prevents blocking
- Pretext text measurement prevents layout shift

## Deployment Notes

No database changes, no new dependencies. All changes are CSS/HTML improvements and translation updates.
