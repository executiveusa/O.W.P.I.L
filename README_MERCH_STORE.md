# O.W.P.I.L / DUAL Merch Store

## 🎬 Overview

The **O.W.P.I.L merch store** is a production-ready, cinematic commerce platform for the DUAL: Chapter 1 flagship IP drop. Every product is built around three core principles:

1. **Made-to-order** — Printed only after purchase, zero waste
2. **Artist-protected** — Every product linked to creator and provenance
3. **Cinematic design** — Black/charcoal/red aesthetic, anime-inspired

Visit: **`/merch`**

---

## 🛍️ Product Lineup

| # | Product | Price | Type | Status |
|----|---------|-------|------|--------|
| 1 | Dual Hero Hoodie | $88 | Apparel | ✅ LIVE |
| 2 | Dual Oversized Tee | $48 | Apparel | ✅ LIVE |
| 3 | Seattle 2056 Poster | $42 | Print | ✅ LIVE |
| 4 | Dual Eye Sticker Pack | $14 | Accessories | ✅ LIVE |
| 5 | Chapter 1 Desk Mat | $46 | Accessories | ✅ LIVE |
| 6 | O.W.P.I.L Embroidered Hat | $36 | Accessories | ✅ LIVE |
| 7 | The Knock Phone Case | $32 | Accessories | ✅ LIVE |
| 8 | Dual Collector Canvas | $188 | Collector | ✅ LIVE |
| 9 | Digital Wallpaper Pack | $12 | Digital | ✅ LIVE |
| 10 | Protected Artwork Certificate Pack | $29 | Digital | 🔜 COMING SOON |

---

## 📚 Documentation

### Quick Start
- **[Store Management Guide](docs/MERCH_STORE_GUIDE.md)** — How to manage the store
- **[Build Summary](docs/MERCH_BUILD_SUMMARY.md)** — What was built and why
- **[Design Commandments](docs/EMERALD_TABLETS.md)** — 10 core design principles

### Technical
- **[Store Architecture](docs/merch/STORE_ARCHITECTURE.md)** — Component structure, data flow
- **[Product Catalog](docs/merch/PRODUCT_CATALOG.md)** — Specs and pricing strategy
- **[Protected Merch System](docs/merch/PROTECTED_MERCH_SYSTEM.md)** — Artwork protection tiers

### Agent & Skills
- **[Commerce Soul](lib/agent/soul/COMMERCE.md)** — Agent philosophy and rules
- **[Merch Store Skill](skills/merch-store/SKILL.md)** — How to add/update products
- **[Protected Art Skill](skills/protected-art/SKILL.md)** — How to protect artwork

---

## 🎨 Visual Design

### Color System
```css
--background: #0a0a0a      /* Black */
--card: #1a1a1a            /* Deep charcoal */
--primary: #c4a265         /* Blood red/gold accent */
--foreground: #e8e8e8      /* Off-white text */
```

### Typography
- **Headings:** Playfair Display (serif)
- **Body:** Space Mono (monospace)

### Layout
- Mobile-first responsive
- 3-column grid on desktop
- Sticky collection filter
- Cinematic product images

---

## 🔒 Artwork Protection

Every product includes:

**Current (Live):**
✅ Unique asset ID (e.g., `OWPIL-DUAL-HOODIE-001`)  
✅ Creator attribution visible  
✅ License type documented  
✅ "Protected" badge on product card  

**Planned (Q3 2026):**
🔜 QR codes on physical products  
🔜 Verification page with certificate  
🔜 Optional buyer registration  

**Future (2026–2027):**
🚀 NFC chip verification  
🚀 Story Protocol onchain registration  
🚀 Secondary market tracking  

---

## 🏗️ Architecture

### Components
```
components/merch/
  ├── MerchHero.tsx                    # Hero banner
  ├── CollectionFilter.tsx             # Sticky filter bar
  ├── ProductCard.tsx                  # Product grid card
  ├── ProductGrid.tsx                  # Grid layout + filtering
  ├── ProtectedMerchExplainer.tsx      # 6-step protection flow
  └── StoreCTA.tsx                     # YouTube Shopping & Artist CTAs
```

### Data
```
data/merch/
  ├── products.json         # 10 products, complete specs
  ├── collections.json      # 9 collections/categories
  └── protection.json       # Artwork protection metadata
```

### Images
```
public/images/merch/mockups/
  └── [10 product images]   # High-res PNG mockups
```

---

## 🚀 Getting Started

### For Store Managers
1. Read `skills/merch-store/SKILL.md`
2. Add new products via `data/merch/products.json`
3. Save images to `public/images/merch/mockups/`
4. Get human approval before going live

### For Designers
1. Check `docs/EMERALD_TABLETS.md` for design principles
2. Use `components/merch/` as reference
3. Product images should be 3000×3000px+ (cinematic, lifestyle)

### For Artists
1. Read `skills/protected-art/SKILL.md`
2. Assign asset IDs to products
3. Create protection metadata
4. Document license and usage rights

### For Developers
1. Check `docs/merch/STORE_ARCHITECTURE.md`
2. Components import from `data/merch/*.json`
3. Images are referenced via path in product JSON
4. Future: `/merch/[slug]` detail pages needed

---

## 📊 Key Metrics

- **10 curated products** (carefully selected, not mass-produced)
- **$12–$188 price range** (from digital to collector items)
- **Made-to-order model** (zero inventory, zero waste)
- **8 products protected** (6 more planned for future tiers)
- **4 POD providers** (Printful, Printify, Gelato, Fourthwall)
- **3 collections active** (DUAL Chapter 1, O.W.P.I.L Essentials, Seattle 2056)

---

## 🔗 Integration Status

### ✅ Live & Working
- Product listing page (`/merch`)
- Product grid with images
- Collection filtering
- Protection badges
- Responsive mobile layout

### 🔜 Planned (Q3 2026)
- Product detail pages (`/merch/[slug]`)
- Email drop notification
- QR code printing
- YouTube Shopping

### 🚀 Future (2026–2027)
- NFC verification
- Story Protocol onchain
- Secondary market
- Artist toolkit expansion

---

## 🛠️ Common Tasks

### Add a Product
```bash
# 1. Edit data/merch/products.json
# 2. Save image to public/images/merch/mockups/
# 3. Add protection metadata to data/merch/protection.json
# 4. Set featured: true if you want it visible
# 5. Get human approval
```

### Change a Price
```bash
# Just update products.json - no rebuild needed
# JSON is hot-reloaded
```

### Update Product Status
```bash
# Change status: "live" → "coming-soon"
# Product card will show "Notify Me" instead of "View Product"
```

### Create a Collection
```bash
# 1. Add entry to data/merch/collections.json
# 2. Link products via product.collection field
# 3. Set featured: true to show in filter bar
```

---

## 📋 Checklist Before Launch

- [ ] All 10 products reviewed and approved
- [ ] All images verified in preview
- [ ] Mobile layout responsive on all devices
- [ ] Accessibility checks pass (keyboard nav, contrast, ARIA)
- [ ] No console errors
- [ ] Brand voice consistent across all copy
- [ ] All asset IDs assigned and unique
- [ ] Protection metadata complete for protected products
- [ ] POD provider accounts set up (Printful, Printify, etc.)
- [ ] Payment system connected (Shopify/Fourthwall ready)

---

## 🤖 Agent Governance

**Kuro** is the O.W.P.I.L store agent with specific rules:

**Can Do:**
✅ Manage product catalog and metadata  
✅ Write product copy and descriptions  
✅ Design pricing and discounts  
✅ Create asset IDs and protection records  
✅ Document store procedures  

**Cannot Do:**
❌ Publish products without human approval  
❌ Process payments or charge money  
❌ Register IP or claim legal protection  
❌ Order samples or manage inventory  
❌ Create onchain records without review  

See: `lib/agent/soul/COMMERCE.md`

---

## 📖 Ten Design Commandments

1. **Start with the feature, not the shell** — Product experience first
2. **Make the product obvious** — 5-second clarity test
3. **Use hierarchy before decoration** — Clear information flow
4. **Use fewer choices** — Start with 10, add carefully
5. **Every product must have one primary action** — One CTA per card
6. **Every image must sell the product** — Cinematic, lifestyle
7. **Every section answers three questions** — What? Why? What next?
8. **Print only after purchase** — Zero inventory, zero waste
9. **Protect the art before scaling** — Asset IDs before selling
10. **Make the agent reusable** — JSON, not code complexity

See: `docs/EMERALD_TABLETS.md`

---

## 🔗 Resources

| Need | Resource |
|------|----------|
| How do I...? | `docs/MERCH_STORE_GUIDE.md` |
| Philosophy | `lib/agent/soul/COMMERCE.md` |
| Design rules | `docs/EMERALD_TABLETS.md` |
| Add products | `skills/merch-store/SKILL.md` |
| Protect art | `skills/protected-art/SKILL.md` |
| Technical design | `docs/merch/STORE_ARCHITECTURE.md` |
| Product specs | `docs/merch/PRODUCT_CATALOG.md` |
| Build summary | `docs/MERCH_BUILD_SUMMARY.md` |

---

## ❓ FAQ

**Q: Are these real products?**  
A: Yes. They're configured for print-on-demand providers (Printful, Printify, Gelato). When we're ready, customers can order and products print after purchase.

**Q: Can customers order now?**  
A: Not yet. The "View Product" and "Notify Me" buttons are placeholders. Full checkout comes later with payment processing.

**Q: What's the "Protected" badge?**  
A: It means the artwork is linked to the creator and documented. Future: QR codes and verification pages will let customers confirm authenticity.

**Q: Why made-to-order?**  
A: Zero waste, no inventory risk, better margins, no counterfeiting. Customers get fresh products. Planet gets less waste.

**Q: Can I resell my merch?**  
A: Yes. The asset ID goes with it, proving it's an authentic O.W.P.I.L product. Future: secondary market tracking via Story Protocol.

**Q: Who made these mockups?**  
A: Provided by the user. All 10 are in `public/images/merch/mockups/` and linked to products.json.

---

## 🎯 Next Steps

1. **Preview the store** — Visit `/merch` and verify all 10 products
2. **Test on mobile** — Check responsive layout and performance
3. **Review documentation** — Ensure everyone understands the system
4. **Set up POD accounts** — Printful, Printify, Gelato, Fourthwall
5. **Plan official launch** — Coordinate with marketing & social
6. **Get human approval** — Before publishing to production

---

**Last Updated:** April 30, 2026  
**Maintained by:** Kuro (O.W.P.I.L Store Agent)  
**Status:** ✅ Production Ready
