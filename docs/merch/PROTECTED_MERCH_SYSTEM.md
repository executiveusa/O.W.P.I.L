# O.W.P.I.L Protected Merch System

## Overview

Protected merch is the O.W.P.I.L philosophy in action: every product is tied to the original artwork, the creator record, and a verifiable chain of provenance. This prevents art theft, counterfeit goods, and invisible resale of protected intellectual property.

## Protection Tiers

### Tier 1: Asset ID + Metadata (Current)
- Unique asset ID (e.g., OWPIL-DUAL-HOODIE-001)
- Creator attribution
- Series / chapter metadata
- License type and usage rights
- Verification URL (future)
- IPFS hash placeholder

**Status:** Live on all protected products  
**Cost:** None (baked into product listing)  
**Scope:** 8 of 10 current products

---

### Tier 2: QR Code Verification (Planned)
- Physical QR code printed on product
- Links to verification page with:
  - Asset ID
  - Creator name and signature
  - Certificate of authenticity
  - License type
  - Date of purchase / batch number

**Status:** Planned for premium apparel & collector editions  
**Timeline:** Q3 2026  
**Cost:** +$0.50 per item (print integration)  
**Scope:** Hoodies, collector canvas, posters

---

### Tier 3: NFC Chip Integration (Future)
- Embedded NFC chip in product packaging
- Tap-to-verify with smartphone
- Updates buyer record on secure backend
- Creates immutable proof of ownership

**Status:** Planning phase  
**Timeline:** Q4 2026 / Q1 2027  
**Cost:** +$1.50–$2.00 per item  
**Scope:** Premium collector editions only

---

### Tier 4: Story Protocol Attestation (Future)
- Products registered on Story Protocol
- Onchain proof of provenance
- Optional: buyer attestations
- Enables future secondary market trust

**Status:** Research phase  
**Timeline:** 2027+  
**Cost:** TBD (Story Protocol pricing)  
**Scope:** Limited collector editions & high-value pieces

---

## Asset ID Structure

```
[BRAND]-[SERIES]-[PRODUCT_TYPE]-[VERSION]

Example: OWPIL-DUAL-HOODIE-001
         OWPIL = Brand
         DUAL = Series
         HOODIE = Product type
         001 = First release/batch
```

### Current Asset IDs

| Product | Asset ID |
|---------|----------|
| Dual Hero Hoodie | OWPIL-DUAL-HOODIE-001 |
| Dual Oversized Tee | OWPIL-DUAL-TEE-001 |
| Seattle 2056 Poster | OWPIL-SEATTLE-POSTER-001 |
| Dual Eye Sticker Pack | OWPIL-DUAL-STICKERS-001 |
| Chapter 1 Desk Mat | OWPIL-DUAL-DESKMAT-001 |
| O.W.P.I.L Embroidered Hat | OWPIL-ESSENTIALS-HAT-001 |
| The Knock Phone Case | OWPIL-KNOCK-CASE-001 |
| Dual Collector Canvas | OWPIL-DUAL-CANVAS-001 |
| Digital Wallpaper Pack | OWPIL-DIGITAL-WALLPAPER-001 |
| Protected Artwork Certificate Pack | OWPIL-ART-CERT-001 |

---

## protection.json Schema

```json
{
  "assetId": "OWPIL-DUAL-HOODIE-001",
  "title": "Dual Hero Hoodie",
  "creator": "O.W.P.I.L / Tyshawn Morehead",
  "series": "DUAL",
  "chapter": "Chapter 1: The Knock",
  "originalFile": "dual-hero-hoodie-master.psd",
  "hashPlaceholder": "QmV1YWY2N2I2ZjZkNGY0YzhjNTk4MjM4NzYwYTAwZWMxOA==",
  "license": "Limited Commercial Use",
  "usageRights": "Print on demand only. No resale of digital files.",
  "verificationUrl": "https://owpil.com/verify/OWPIL-DUAL-HOODIE-001",
  "qrEnabled": true,
  "nfcEnabled": false,
  "easEnabled": false,
  "storyProtocolReady": false
}
```

### Field Definitions

- **assetId:** Unique identifier matching product.assetId
- **title:** Display name of the artwork
- **creator:** Original artist(s) and O.W.P.I.L attribution
- **series:** IP series (DUAL, O.W.P.I.L, etc.)
- **chapter:** Edition or release info
- **originalFile:** Filename reference of master artwork (PSD, AI, etc.)
- **hashPlaceholder:** IPFS hash or content hash placeholder
- **license:** License type (Limited Commercial Use, Personal Use Only, etc.)
- **usageRights:** Detailed restriction text (no redistribution, print-on-demand only, etc.)
- **verificationUrl:** URL to verification page (future implementation)
- **qrEnabled:** Whether QR code is printed on physical product
- **nfcEnabled:** Whether NFC chip is embedded
- **easEnabled:** Whether Ethereum Attestation Service is used
- **storyProtocolReady:** Whether prepared for Story Protocol registration

---

## Verification Flow (Future)

### Current State
1. Customer buys product
2. Product includes asset ID in description and tag
3. Packing slip / digital receipt includes asset ID

### Planned: QR Code (Q3 2026)
1. Customer receives product
2. Product packaging or tag includes QR code
3. Customer scans QR code
4. Verification page loads with:
   - Full artwork provenance
   - Certificate of authenticity
   - Creator signature
   - Purchase date / batch number
   - License summary
5. Customer can share verification link

### Planned: NFC (Q4 2026)
1. Customer taps product with smartphone
2. NFC chip redirects to verification page
3. Buyer ownership is recorded (optional)
4. Creates immutable proof of authenticity

---

## Artist Protection Philosophy

Every O.W.P.I.L product embodies these principles:

1. **Creator First** — Artist attribution is permanent, non-removable
2. **Proof of Origin** — Artwork is traceable to original file and creator
3. **No Inventory Waste** — Made-to-order means zero counterfeit inventory
4. **License Clarity** — Every product includes clear usage restrictions
5. **Future-Ready** — Infrastructure prepared for onchain attestations
6. **Privacy Respected** — Buyer data is minimal, verification is optional

---

## Implementing Protection for New Products

### Checklist

1. **Assign Asset ID**
   - Format: `[BRAND]-[SERIES]-[TYPE]-[VERSION]`
   - Example: `OWPIL-DUAL-TOTE-001`

2. **Create protection.json Entry**
   - Reference original PSD/AI file
   - Document creator attribution
   - Define license type
   - Write usage rights (no redistribution, POD only, etc.)
   - Placeholder verification URL

3. **Update products.json**
   - Link assetId to product
   - Set `"protected": true`
   - Define `"providerTarget"` (Printful/Printify/Gelato)

4. **Brand Messaging**
   - Add "Protected" badge to product card
   - Include protection statement in description
   - Reference artwork protection in category messaging

5. **QR Code Prep (Optional)**
   - Set `"qrEnabled": true` in protection.json
   - Create verification page placeholder at `/verify/[assetId]`
   - Prepare QR code generation via print provider

6. **Testing**
   - Verify product card displays correctly
   - Check badge visibility
   - Confirm protection.json links correctly

---

## Provider Integration

Each provider handles artwork protection differently:

### Printful
- ✓ Supports custom labels
- ✓ Can print product hang tags with QR code
- ⚠ Requires manual upload of QR code image
- Timeline: Q3 2026

### Printify
- ✓ Allows custom packaging
- ✓ Can include printed inserts
- ⚠ QR code requires separate file upload per product
- Timeline: Q3 2026

### Gelato
- ✓ Supports custom packaging labels
- ✓ Can print product inserts
- ✓ Best for poster/canvas with full-color printing
- Timeline: Q2 2026

### Fourthwall
- ✓ Creator-friendly, YouTube-native
- ✓ Fastest integration for merch drops
- ⚠ Limited custom packaging options
- Timeline: Q2 2026

---

## Compliance & Legal

### Current (No Claims)
- Asset ID is documentation only
- No legal protection claims
- No onchain records
- Purely informational

### QR Code Era (Q3 2026)
- Verification URL confirms creator identity
- Certificate of authenticity included
- No legal protection implied
- Optional buyer registration

### Future (Story Protocol, Q4 2026+)
- Potential: Registered IP on Story Protocol
- Potential: Buyer attestations on Ethereum
- **Requires legal review** before implementation

**Rule:** Never claim legal protection without human review from O.W.P.I.L's legal team.

---

## FAQ

**Q: Does protected merch mean I own the copyright?**  
A: No. The certificate proves you bought an authentic O.W.P.I.L product. The creator retains all copyrights.

**Q: Can I resell a protected item?**  
A: Yes, but the original asset ID goes with it, proving it's an authentic first release. Future Story Protocol integration may track secondary sales.

**Q: What if I lose my verification QR/NFC?**  
A: Each product has an asset ID printed in the description. You can always verify at https://owpil.com/verify/[assetId].

**Q: Can artists use O.W.P.I.L protection tools?**  
A: Yes! The Protected Artwork Certificate Pack (coming soon) is designed for this.

---

**Last Updated:** April 30, 2026  
**Maintainer:** Kuro (O.W.P.I.L Store Agent)  
**Legal Status:** Under review for QR/NFC expansion
