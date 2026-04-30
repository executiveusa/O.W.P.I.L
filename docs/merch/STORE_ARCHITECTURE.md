# O.W.P.I.L Merch Store Architecture

## Overview

The O.W.P.I.L merch store is a premium, made-to-order product catalog built around the DUAL: Chapter 1 flagship IP drop. All products are printed only after purchase, protecting the environment and ensuring zero waste.

## Directory Structure

```
/app/merch/
  ├── page.tsx              # Main store page
  └── [slug]/               # Individual product pages (future)

/components/merch/
  ├── MerchHero.tsx         # Hero banner with store messaging
  ├── ProductCard.tsx       # Individual product card with image, price, badges
  ├── ProductGrid.tsx       # Grid layout for products with filtering
  ├── CollectionFilter.tsx  # Sticky collection/category filter bar
  ├── ProtectedMerchExplainer.tsx # 6-step process for artwork protection
  └── StoreCTA.tsx          # YouTube Shopping & Artist Protection CTAs

/data/merch/
  ├── products.json         # Master product catalog (10 items)
  ├── collections.json      # Product collections/categories
  └── protection.json       # Artwork protection metadata

/public/images/merch/
  ├── mockups/              # Product lifestyle images (from user-provided PNG files)
  ├── products/             # Product detail shots (future)
  └── digital/              # Digital product previews (future)

/docs/merch/
  ├── STORE_ARCHITECTURE.md # This file
  ├── PRODUCT_CATALOG.md    # Detailed product specs
  ├── PROTECTED_MERCH_SYSTEM.md # Artwork protection system
  ├── YOUTUBE_SHOPPING_PLAN.md  # YouTube integration roadmap
  └── POD_AUTOMATION_PLAN.md    # Print-on-demand provider setup
```

## Data Structure

### products.json

Each product contains:
- **id** (number): Unique identifier
- **slug** (string): URL-friendly identifier
- **name** (string): Display name
- **category** (string): apparel | prints | accessories | collector | digital
- **collection** (string): Collection grouping from collections.json
- **price** (number): Selling price in USD
- **compareAtPrice** (number): Original/MSRP price
- **status** (string): live | coming-soon
- **image** (string): Path to mockup image in /public/images/merch/mockups/
- **shortDescription** (string): 1-line product summary
- **description** (string): Full product description with features
- **tags** (array): Product keywords
- **providerTarget** (string): Printful | Printify | Gelato | Fourthwall
- **protected** (boolean): True if artwork has protection metadata
- **digital** (boolean): True if digital download, false if physical
- **featured** (boolean): True if shown on main grid
- **assetId** (string): Unique artwork identifier (e.g., OWPIL-DUAL-HOODIE-001)

### collections.json

Each collection contains:
- **id** (string): Unique identifier
- **name** (string): Display name
- **slug** (string): URL-friendly identifier
- **description** (string): Collection overview
- **featured** (boolean): True if shown in filter bar

### protection.json

Each protected artwork contains:
- **assetId** (string): Matches product assetId
- **title** (string): Artwork title
- **creator** (string): Original artist/creator
- **series** (string): IP series name
- **chapter** (string): Chapter or edition
- **originalFile** (string): Reference to source file format
- **hashPlaceholder** (string): IPFS hash placeholder
- **license** (string): License type
- **usageRights** (string): Detailed usage restrictions
- **verificationUrl** (string): URL to verification page
- **qrEnabled** (boolean): QR code on physical product
- **nfcEnabled** (boolean): NFC chip available
- **easEnabled** (boolean): Ethereum Attestation Service ready
- **storyProtocolReady** (boolean): Story Protocol integration pending

## Component Hierarchy

```
/merch [page]
  └─ Navbar
  └─ MerchHero
  └─ CollectionFilter (sticky)
  └─ ProductGrid
      └─ ProductCard (x10)
  └─ ProtectedMerchExplainer
  └─ StoreCTA
  └─ Footer
```

## State Management

- **activeFilter** (string): Currently selected collection or category
  - Updates via `CollectionFilter.onFilterChange()`
  - Passed to `ProductGrid.filter` prop
  - Default: "all"

## Key Features

### Product Cards
- Image with hover zoom effect
- Price with compare-at discount calculation
- Collection badge
- Protection status badge
- Digital download badge
- Coming Soon overlay for unreleased items
- CTA button (View Product / Notify Me)

### Collection Filter
- Sticky positioning below navbar
- Shows only featured collections from collections.json
- Active state styling
- Horizontal scroll on mobile

### Protected Merch Explainer
- 6-step process visualization
- Educational copy about artwork protection
- Prepares customers for future QR/NFC/verification

### Store CTAs
- YouTube Shopping integration teaser
- Artist Protection Tools promotion
- Links to future features (coming-soon)

## Product Image Placement

Product images are referenced from `/public/images/merch/mockups/`:
- dual-hero-hoodie.png
- dual-oversized-tee.png
- seattle-2056-poster.png
- dual-eye-sticker-pack.png
- chapter-1-desk-mat.png
- owpil-embroidered-hat.png
- the-knock-phone-case.png
- dual-collector-canvas.png
- digital-wallpaper-pack.png
- protected-artwork-certificate-pack.png

These are user-provided mockup images that showcase each product in a lifestyle context.

## Future Routes

- `/merch/[slug]` — Individual product detail page
- `/merch/protected` — Artwork protection guide
- `/merch/digital` — Digital downloads page
- `/merch/collector-editions` — Limited collector editions

## Payment Placeholder

Currently, all CTAs point to:
- "View Product" → future `/merch/[slug]` page
- "Notify Me" → future email waitlist
- Custom orders → `mailto:contact@owpil.com`

**DO NOT implement real payment yet.** This is prepared for future Shopify/Fourthwall integration.

## Provider Targets

Each product references a Print-on-Demand provider:
- **Printful** — Premium apparel (hoodies, tees, hats)
- **Printify** — Broad catalog (stickers, desk mats, phone cases)
- **Gelato** — Posters and canvas prints
- **Fourthwall** — Fastest YouTube creator merch platform

**Integration is manual.** Products are not yet synced to these platforms.

## Brand Voice

- Cinematic, anime-inspired aesthetic
- Dark mode (black/deep charcoal background)
- Blood-red accents (#c4a265 primary / accent colors)
- Distressed white typography
- Monospace font (Space Mono) for technical details
- Serif font (Playfair) for headlines
- No inventory messaging (made-to-order, printed after purchase)
- Artist protection philosophy (every product is provenance-linked)

## Next Steps

1. Upload/sync mockup images to `/public/images/merch/mockups/`
2. Create product detail page at `/merch/[slug]`
3. Implement email waitlist or drop notification system
4. Set up Shopify/Fourthwall product sync
5. Add QR code generation for physical products
6. Integrate story protocol for onchain attestations
7. Build artist protection tool section
8. Add YouTube Shopping module integration

---

**Last Updated:** April 30, 2026
**Maintainer:** Kuro (O.W.P.I.L Store Agent)
