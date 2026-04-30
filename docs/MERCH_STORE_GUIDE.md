# O.W.P.I.L Merch Store — Complete Guide

## Quick Start

The O.W.P.I.L merch store is now live at `/merch`. It features:

- **10 curated products** spanning apparel, prints, accessories, and digital downloads
- **Made-to-order model** — printed only after purchase, zero waste
- **Artwork protection system** — every product linked to creator and provenance
- **Print-on-demand providers** — Printful, Printify, Gelato, Fourthwall
- **Cinematic design** — black/charcoal/red aesthetic, anime-inspired

## For Store Managers

### Adding a Product

1. **Create product JSON entry** in `data/merch/products.json`
2. **Save mockup image** to `public/images/merch/mockups/product-slug.png`
3. **Add protection metadata** to `data/merch/protection.json` (if protected)
4. **Assign asset ID** (e.g., `OWPIL-DUAL-HOODIE-001`)
5. **Get human approval** before going live

See: `skills/merch-store/SKILL.md`

### Updating a Product

- Price changes → edit `products.json`, no rebuild needed
- Image changes → replace file in `/public/images/merch/mockups/`
- Status changes → edit `status: "live"` or `status: "coming-soon"`
- Description changes → edit `description` field in JSON

### Creating a Collection

1. Add entry to `data/merch/collections.json`
2. Link products via `product.collection` field
3. Set `featured: true` to show in filter bar

## For Designers

### Product Mockup Requirements

- **Size:** 1200×1200px minimum (3000×3000px preferred)
- **Format:** PNG or JPEG
- **Style:** Cinematic, lifestyle context, product in use
- **Aesthetic:** Match DUAL Chapter 1 visual language
- **Location:** `/public/images/merch/mockups/[product-slug].png`

### Design System

See `docs/EMERALD_TABLETS.md` for 10 core design commandments.

**Color Palette:**
- Background: #0a0a0a (black)
- Cards: #1a1a1a (deep charcoal)
- Accent: #c4a265 (blood red/gold)
- Text: #e8e8e8 (off-white)

**Typography:**
- Headings: Playfair (serif)
- Body: Space Mono (monospace)
- Spacing: Tailwind scale (p-4, gap-6, etc.)

## For Product Specialists

### Product Pricing

| Tier | Range | Margin | Examples |
|------|-------|--------|----------|
| Digital | $10–$30 | 80%+ | Wallpapers, certs |
| Accessory | $14–$36 | 50–60% | Stickers, hats, cases |
| Mid | $42–$48 | 40–50% | Posters, deskmats, tees |
| Premium | $88+ | 30–40% | Hoodies, collectors |

**Strategy:** High-margin items cross-subsidize low-margin premium apparel.

### Product Descriptions

Write in this order:

1. **What is it?** (1 line, product name)
2. **Why should I care?** (1 line, benefit/emotion)
3. **What are the details?** (2–3 sentences, specs)
4. **How is it made?** (1 sentence, provider, shipping)

Example:
> Dual Hero Hoodie
> A cinematic black heavyweight hoodie built around DUAL: Chapter 1 — The Knock.
> Premium 100% cotton, oversized fit, front chest O.W.P.I.L mark, full back hero artwork, sleeve detail embroidery.
> Made to order via Printful, shipped worldwide in 5-7 days.

### Asset ID Assignment

**Format:** `[BRAND]-[SERIES]-[PRODUCT_TYPE]-[VERSION]`

```
OWPIL = Brand
DUAL = IP Series
HOODIE = Product Type
001 = First release
```

**Product Types:**
- Apparel: HOODIE, TEE, HAT, JACKET, SOCKS, GLOVE
- Prints: POSTER, CANVAS, PRINT, ART
- Accessories: STICKERS, CASE, DESKMAT, KEYCHAIN, MUG, TOTE
- Digital: WALLPAPER, PDF, ZIP, CERT

**Examples:**
- `OWPIL-DUAL-HOODIE-001`
- `OWPIL-SEATTLE-POSTER-001`
- `OWPIL-ESSENTIALS-HAT-001`
- `OWPIL-DIGITAL-WALLPAPER-001`

## For Artists & Creators

### Using the Protected Artwork System

Every O.W.P.I.L product is linked to the original artwork.

**Current (Tier 1):**
- Asset ID on product listing
- Creator attribution visible
- License type documented
- Protection metadata in JSON

**Planned (Tier 2, Q3 2026):**
- QR codes on physical products
- Verification page with certificate
- Optional buyer registration

**Future (Tier 3+, 2026–2027):**
- NFC chip verification
- Story Protocol onchain registration
- Secondary market tracking

See: `docs/merch/PROTECTED_MERCH_SYSTEM.md`

### Asset Protection Checklist

Before shipping a product:

- [ ] Unique asset ID assigned
- [ ] Creator name visible on product
- [ ] License type documented
- [ ] Usage rights clearly stated
- [ ] Original file reference included
- [ ] Verification URL placeholder created
- [ ] Protection metadata in protection.json
- [ ] "Protected" badge on product card

## For Operations & Fulfillment

### Print-on-Demand Workflow

1. **Customer orders** on `/merch`
2. **Order received** (payment processed by store system)
3. **Notification sent** to POD provider
4. **Product printed** only after payment confirmed
5. **Quality checked** (automated or manual)
6. **Shipped** with packing slip (includes asset ID)
7. **Tracking sent** to customer

### Provider Setup (Future)

Each provider needs setup before real orders can go live:

**Printful** (Premium Apparel)
- Create account
- Upload product template designs
- Configure size/color variants
- Set shipping & fulfillment rules
- Test sample order

**Printify** (Broad Catalog)
- Create account
- Connect print partners (varies by region)
- Upload artwork files
- Configure variants
- Test across partners

**Gelato** (Wall Art)
- Create account
- Upload high-res artwork
- Configure print options
- Test quality
- Set regional fulfillment

**Fourthwall** (YouTube Native)
- Create creator account
- Sync product catalog
- Configure YouTube Shopping
- Link to channel
- Enable merch shelf

## For Developers

### Component Structure

```
/components/merch/
  ├─ MerchHero.tsx         # Hero banner
  ├─ CollectionFilter.tsx  # Sticky filter bar
  ├─ ProductCard.tsx       # Product grid card
  ├─ ProductGrid.tsx       # Grid container with filtering
  ├─ ProtectedMerchExplainer.tsx  # 6-step protection flow
  └─ StoreCTA.tsx          # YouTube Shopping & Artist Protection
```

### Data Structure

```
/data/merch/
  ├─ products.json         # 10-item product catalog
  ├─ collections.json      # Collection metadata
  └─ protection.json       # Artwork protection records
```

### Key Props

**ProductCard:**
```tsx
interface ProductCardProps {
  slug: string
  name: string
  price: number
  compareAtPrice: number
  image: string
  shortDescription: string
  collection: string
  protected: boolean
  digital: boolean
  status: "live" | "coming-soon"
}
```

**ProductGrid:**
```tsx
interface ProductGridProps {
  filter?: string     // Collection slug to filter by
  featured?: boolean  // Show only featured products
}
```

### Adding Product Detail Pages

Create `/app/merch/[slug]/page.tsx`:

```tsx
'use client'

import { useParams } from 'next/navigation'
import products from '@/data/merch/products.json'

export default function ProductDetail() {
  const { slug } = useParams()
  const product = products.find(p => p.slug === slug)
  
  if (!product) return <NotFound />
  
  return (
    <>
      <Navbar />
      <main>
        {/* Large product image */}
        {/* Full description */}
        {/* Pricing & CTA */}
        {/* Related products */}
      </main>
      <Footer />
    </>
  )
}
```

Data is already structured to support this.

### Environment Variables (Future)

When integrating with POD providers:

```env
PRINTFUL_API_KEY=
PRINTIFY_API_KEY=
GELATO_API_KEY=
FOURTHWALL_API_KEY=
```

### Testing Checklist

```bash
# Start dev server
pnpm dev

# Navigate to /merch
# Verify:
- [ ] Products load
- [ ] Images display
- [ ] Prices show correct discount %
- [ ] Filter buttons work
- [ ] Collection filter is sticky
- [ ] "Coming Soon" overlay works
- [ ] Mobile layout responsive
- [ ] No console errors
- [ ] No accessibility violations (axe, lighthouse)
```

## File Structure Summary

```
O.W.P.I.L/
├── app/
│   └── merch/
│       └── page.tsx              # Main store page
├── components/
│   └── merch/
│       ├── MerchHero.tsx
│       ├── CollectionFilter.tsx
│       ├── ProductCard.tsx
│       ├── ProductGrid.tsx
│       ├── ProtectedMerchExplainer.tsx
│       └── StoreCTA.tsx
├── data/
│   └── merch/
│       ├── products.json
│       ├── collections.json
│       └── protection.json
├── public/
│   └── images/
│       └── merch/
│           └── mockups/
│               ├── dual-hero-hoodie.png
│               ├── dual-oversized-tee.png
│               ├── seattle-2056-poster.png
│               ├── dual-eye-sticker-pack.png
│               ├── chapter-1-desk-mat.png
│               ├── owpil-embroidered-hat.png
│               ├── the-knock-phone-case.png
│               ├── dual-collector-canvas.png
│               ├── digital-wallpaper-pack.png
│               └── protected-artwork-certificate-pack.png
├── docs/
│   ├── EMERALD_TABLETS.md        # 10 design commandments
│   ├── MERCH_STORE_GUIDE.md      # This file
│   └── merch/
│       ├── STORE_ARCHITECTURE.md
│       ├── PRODUCT_CATALOG.md
│       ├── PROTECTED_MERCH_SYSTEM.md
│       ├── YOUTUBE_SHOPPING_PLAN.md
│       └── POD_AUTOMATION_PLAN.md
├── lib/
│   └── agent/
│       └── soul/
│           └── COMMERCE.md       # Commerce philosophy & rules
└── skills/
    ├── merch-store/
    │   └── SKILL.md              # Store management guide
    └── protected-art/
        └── SKILL.md              # Artwork protection guide
```

## Key Documents

| Document | Purpose | For |
|----------|---------|-----|
| `docs/EMERALD_TABLETS.md` | 10 design commandments | Everyone |
| `docs/MERCH_STORE_GUIDE.md` | This overview | Everyone |
| `docs/merch/STORE_ARCHITECTURE.md` | Technical design | Developers |
| `docs/merch/PRODUCT_CATALOG.md` | Product specs | Product managers |
| `docs/merch/PROTECTED_MERCH_SYSTEM.md` | Protection system | Artists, legal |
| `lib/agent/soul/COMMERCE.md` | Philosophy & rules | Store managers |
| `skills/merch-store/SKILL.md` | How to add products | Store ops |
| `skills/protected-art/SKILL.md` | How to protect art | Artists |

## Next Steps

### Immediate (Week 1)
- [ ] Deploy `/merch` to staging
- [ ] Test all 10 products in preview
- [ ] Verify images load correctly
- [ ] Check mobile responsiveness

### Short-term (Weeks 2–4)
- [ ] Set up Shopify/Fourthwall test accounts
- [ ] Sync first 2–3 products to test POD
- [ ] Order sample from each provider
- [ ] Approve artwork protection system
- [ ] Plan YouTube Shopping integration

### Medium-term (Q3 2026)
- [ ] Implement `/merch/[slug]` detail pages
- [ ] Add email drop notification system
- [ ] Enable QR code printing on products
- [ ] Launch first official product drop
- [ ] Measure sales and customer feedback

### Long-term (Q4 2026+)
- [ ] Implement NFC verification
- [ ] Explore Story Protocol integration
- [ ] Build secondary market infrastructure
- [ ] Expand artist protection tools
- [ ] Launch Afformations platform

## Support & Troubleshooting

**Products not showing?**
- Check products.json syntax (use JSON validator)
- Verify `featured: true` if filtering by collection
- Clear browser cache and rebuild

**Images not loading?**
- Check file path matches product.image in JSON
- Verify image exists in `/public/images/merch/mockups/`
- Ensure PNG or JPEG format (not WebP)

**Filter not working?**
- Verify collection slug matches exactly (case-sensitive)
- Check collection exists in collections.json
- Verify product.collection field matches collection name

**Badge not showing?**
- For "Protected": ensure protection.json has matching assetId
- For "Digital": verify `digital: true` in products.json
- Check boolean values are `true`, not `"true"`

## Questions?

See the detailed skill documentation:
- `skills/merch-store/SKILL.md` — Product management
- `skills/protected-art/SKILL.md` — Artwork protection

Or check the soul files:
- `lib/agent/soul/COMMERCE.md` — Philosophy and rules
- `lib/agent/soul/SOUL.md` — Overall agent purpose

---

**Last Updated:** April 30, 2026  
**Maintainer:** Kuro (O.W.P.I.L Store Agent)  
**Status:** Production Ready
