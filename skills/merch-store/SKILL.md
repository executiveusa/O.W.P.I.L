# Merch Store Skill

## Purpose

Manage the O.W.P.I.L merch store product catalog, listings, and marketing assets.

## What This Skill Does

- ✓ Add new products to the catalog
- ✓ Update product descriptions, prices, and metadata
- ✓ Create or update product images and mockups
- ✓ Manage product collections and categories
- ✓ Write product copy and social captions
- ✓ Design pricing strategies
- ✓ Update the product graph
- ✓ Maintain protection metadata
- ✓ Write skill documentation

## What This Skill Does NOT Do

- ✗ Publish to external stores without approval
- ✗ Process payments or charge customers
- ✗ Create inventory or order samples
- ✗ Register IP or claim legal protection
- ✗ Override artist attribution

## Key Files

### Data
- `data/merch/products.json` — Product catalog (10 items)
- `data/merch/collections.json` — Collections and categories
- `data/merch/protection.json` — Artwork protection metadata

### Components
- `components/merch/ProductCard.tsx` — Individual product display
- `components/merch/ProductGrid.tsx` — Grid layout with filtering
- `components/merch/MerchHero.tsx` — Store hero section
- `components/merch/CollectionFilter.tsx` — Sticky filter bar
- `components/merch/ProtectedMerchExplainer.tsx` — 6-step process
- `components/merch/StoreCTA.tsx` — YouTube Shopping & Artist Protection CTAs

### Pages
- `app/merch/page.tsx` — Main store page

### Images
- `public/images/merch/mockups/` — Product lifestyle images

### Docs
- `docs/merch/STORE_ARCHITECTURE.md` — System design
- `docs/merch/PRODUCT_CATALOG.md` — Product specs
- `docs/merch/PROTECTED_MERCH_SYSTEM.md` — Artwork protection
- `lib/agent/soul/COMMERCE.md` — Commerce philosophy
- `docs/EMERALD_TABLETS.md` — Design commandments

## Workflow: Adding a New Product

### 1. Prepare Product Data

Create a new entry in `data/merch/products.json`:

```json
{
  "id": 11,
  "slug": "new-product-slug",
  "name": "Product Display Name",
  "category": "apparel | prints | accessories | collector | digital",
  "collection": "Collection Name",
  "price": 48,
  "compareAtPrice": 64,
  "status": "live | coming-soon",
  "image": "/images/merch/mockups/product-mockup.png",
  "shortDescription": "One-line summary",
  "description": "Full product description with features and benefits",
  "tags": ["tag1", "tag2", "tag3"],
  "providerTarget": "Printful | Printify | Gelato | Fourthwall",
  "protected": true | false,
  "digital": true | false,
  "featured": true | false,
  "assetId": "OWPIL-SERIES-TYPE-001"
}
```

### 2. Assign Protection Metadata (if protected)

Add entry to `data/merch/protection.json`:

```json
{
  "assetId": "OWPIL-SERIES-TYPE-001",
  "title": "Product Name",
  "creator": "O.W.P.I.L / Creator Name",
  "series": "Series Name",
  "chapter": "Edition Info",
  "originalFile": "filename.psd",
  "hashPlaceholder": "Qm...",
  "license": "License Type",
  "usageRights": "Usage restrictions",
  "verificationUrl": "https://owpil.com/verify/ASSETID",
  "qrEnabled": false,
  "nfcEnabled": false,
  "easEnabled": false,
  "storyProtocolReady": false
}
```

### 3. Add to Collection

If creating a new collection, add to `data/merch/collections.json`:

```json
{
  "id": "collection-id",
  "name": "Collection Display Name",
  "slug": "collection-slug",
  "description": "Collection overview",
  "featured": true | false
}
```

### 4. Prepare Product Image

Save high-resolution mockup to:
```
/public/images/merch/mockups/product-slug.png
```

**Requirements:**
- Minimum 1200×1200px (preferably 3000×3000px)
- JPEG or PNG
- Cinematic, lifestyle context
- Shows product in use

### 5. Write Copy

Create or update:
- Short description (1 line, 60 chars max)
- Full description (2–3 sentences, features, shipping info)
- Tags (3–5 relevant keywords)

### 6. Create Asset ID

If product is protected, assign unique ID:
```
[BRAND]-[SERIES]-[PRODUCT_TYPE]-[VERSION]

OWPIL-DUAL-HOODIE-001
OWPIL = Brand
DUAL = Series
HOODIE = Product type
001 = First release
```

### 7. Get Human Approval

Before publishing:
- Kuro prepares all data (JSON, image, copy)
- Human (Tyshawn/O.W.P.I.L team) reviews
- Human approves or requests changes
- Product status moves from draft to live

### 8. Test

Verify in /merch:
- ✓ Product appears in grid
- ✓ Image loads correctly
- ✓ Price and description are accurate
- ✓ Badges display correctly (Protected, Digital, Coming Soon)
- ✓ CTA button works
- ✓ Mobile layout is responsive

## Workflow: Updating a Product

### Change Price
1. Edit `data/merch/products.json`
2. Update `price` and/or `compareAtPrice`
3. Test discount badge calculation
4. No rebuild required (JSON is hot-reloaded)

### Update Description
1. Edit `data/merch/products.json`
2. Update `shortDescription` and/or `description`
3. Test text wrapping on mobile
4. No rebuild required

### Change Status (live → coming-soon)
1. Edit `data/merch/products.json`
2. Change `status: "live"` → `status: "coming-soon"`
3. Product card will show "Notify Me" instead of "View Product"
4. No rebuild required

### Update Image
1. Replace file in `/public/images/merch/mockups/`
2. Keep filename the same (JSON reference doesn't need updating)
3. Clear browser cache if not showing new image
4. No rebuild required

### Add to Collection
1. Edit product entry in `data/merch/products.json`
2. Update `collection` field
3. Ensure collection exists in `data/merch/collections.json`
4. No rebuild required

### Enable Protection
1. Add entry to `data/merch/protection.json` with matching assetId
2. Update product entry: set `protected: true`
3. Add "Protected" badge to product card (automatic)
4. No rebuild required

## QA Checklist

Before publishing any changes:

- [ ] Product appears in /merch grid
- [ ] Image displays at correct size
- [ ] Price shows correctly with discount %
- [ ] Short description is readable (not truncated)
- [ ] Collection tag matches a real collection
- [ ] CTA button is functional
- [ ] Protected badge shows if `protected: true`
- [ ] Digital badge shows if `digital: true`
- [ ] Coming Soon overlay shows if `status: coming-soon`
- [ ] Mobile layout is responsive
- [ ] Browser console has no errors

## Testing in Development

```bash
# Start dev server
pnpm dev

# Navigate to /merch
# Verify changes in browser
# Check mobile viewport (DevTools)
# Test with slow network (DevTools)
```

## Common Issues

**Product not showing in grid?**
- ✓ Check `featured: true` in products.json
- ✓ Verify JSON syntax (use JSON validator if unsure)
- ✓ Clear browser cache
- ✓ Restart dev server

**Image not loading?**
- ✓ Verify image path in products.json matches actual file location
- ✓ Check file exists in `/public/images/merch/mockups/`
- ✓ Image must be JPEG or PNG (not WebP)
- ✓ Clear cache, try incognito window

**Badge not showing?**
- ✓ Check product JSON has correct boolean (`true`, not `"true"`)
- ✓ For "Protected" badge, verify protection.json has matching assetId
- ✓ For "Digital" badge, verify `digital: true` in products.json

**Wrong discount showing?**
- ✓ Verify `price` < `compareAtPrice`
- ✓ Check math: (compareAtPrice - price) / compareAtPrice * 100
- ✓ Example: (64 - 48) / 64 * 100 = 25%

**Collection filter not working?**
- ✓ Verify collection exists in collections.json
- ✓ Check product.collection matches exactly (case-sensitive)
- ✓ Ensure `featured: true` on collection if you want it in filter

## Future: Product Detail Page

When `/merch/[slug]` is built:

```
/merch/dual-hero-hoodie
├─ Large product image
├─ Product name and price
├─ Collection and tags
├─ Full description
├─ Features list
├─ Available sizes/colors
├─ Protection status (if protected)
├─ "Add to Cart" or "Coming Soon"
├─ Related products
└─ Provider info (Printful, etc.)
```

Data structure already supports this. Components need to be created.

## Future: Digital Downloads

For digital products, add a `downloadUrl` field to products.json:

```json
{
  ...
  "digital": true,
  "downloadUrl": "https://storage.owpil.com/downloads/wallpaper-pack.zip",
  ...
}
```

CTA changes to "Download Now" and links directly to file.

---

**Skill Owner:** Kuro (O.W.P.I.L Store Agent)  
**Last Updated:** April 30, 2026
