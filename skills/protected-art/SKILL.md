# Protected Art Skill

## Purpose

Implement artwork protection systems on O.W.P.I.L merch products.

## What This Skill Does

- ✓ Assign unique asset IDs to products
- ✓ Create protection metadata
- ✓ Prepare QR code verification flows (future)
- ✓ Document license and usage rights
- ✓ Design NFC integration (future)
- ✓ Prepare Story Protocol registration (future)
- ✓ Create artist attestation systems

## What This Skill Does NOT Do

- ✗ Claim legal protection without legal review
- ✗ Register copyrights or trademarks
- ✗ Mint NFTs or tokens without approval
- ✗ Bypass artist approval or attribution
- ✗ Create onchain records without planning

## Key Files

- `data/merch/protection.json` — Protection metadata for all products
- `docs/merch/PROTECTED_MERCH_SYSTEM.md` — Protection system overview
- `lib/agent/soul/COMMERCE.md` — Commerce philosophy (includes protection rules)

## Asset ID Format

```
[BRAND]-[SERIES]-[PRODUCT_TYPE]-[VERSION]

OWPIL-DUAL-HOODIE-001
  OWPIL = Brand identifier
  DUAL = IP series name
  HOODIE = Product type (HOODIE, TEE, POSTER, STICKERS, etc.)
  001 = Version/release number (001 for first, 002 for second release, etc.)
```

### Examples

| Product | Asset ID |
|---------|----------|
| Dual Hero Hoodie | OWPIL-DUAL-HOODIE-001 |
| DUAL Oversized Tee | OWPIL-DUAL-TEE-001 |
| Seattle 2056 Poster | OWPIL-SEATTLE-POSTER-001 |
| O.W.P.I.L Embroidered Hat | OWPIL-ESSENTIALS-HAT-001 |
| Dual Collector Canvas | OWPIL-DUAL-CANVAS-001 |

## Protection Metadata Schema

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

| Field | Type | Purpose |
|-------|------|---------|
| assetId | string | Unique product identifier |
| title | string | Product name for certificate |
| creator | string | Original artist attribution |
| series | string | IP series (DUAL, O.W.P.I.L, etc.) |
| chapter | string | Edition or chapter info |
| originalFile | string | Source file reference (PSD, AI, etc.) |
| hashPlaceholder | string | IPFS/content hash (future) |
| license | string | License type classification |
| usageRights | string | Detailed restrictions text |
| verificationUrl | string | Verification page URL |
| qrEnabled | boolean | QR code on physical product |
| nfcEnabled | boolean | NFC chip embedded |
| easEnabled | boolean | Ethereum Attestation Service |
| storyProtocolReady | boolean | Story Protocol registration |

## License Types

### Limited Commercial Use
For most DUAL merch products.

```
Limited Commercial Use:
- Print on demand only
- No wholesale or bulk licensing
- No sublicensing
- For distribution through approved channels
  (Printful, Printify, Gelato, Fourthwall) only
```

### Personal Use Only
For digital downloads (wallpapers, etc.).

```
Personal Use Only:
- No commercial use
- No redistribution
- No resale
- No derivative works without permission
- Desktop, mobile, and device wallpapers only
```

### Trademark Licensed
For branded pieces (hats with O.W.P.I.L mark).

```
Trademark Licensed:
- O.W.P.I.L wordmark is trademarked
- Licensed to approved POD providers only
- No independent reproduction
- Attribution required on all items
```

## Workflow: Protecting a New Product

### 1. Assign Asset ID

Determine product type:
- HOODIE, TEE, HAT, JACKET, PANTS, SOCKS, etc. (apparel)
- POSTER, CANVAS, PRINT, etc. (prints)
- STICKERS, CASE, DESKMAT, KEYCHAIN, etc. (accessories)
- WALLPAPER, CERT, PDF, etc. (digital)

Create ID:
```
OWPIL-SERIES-TYPE-001
```

### 2. Document Original Source

Update protection.json:
```json
"originalFile": "artwork-filename.psd",
"creator": "O.W.P.I.L / Creator Name"
```

### 3. Define License

Determine appropriate license:
- Limited Commercial Use (most products)
- Personal Use Only (digital, wallpapers)
- Trademark Licensed (branded items)

### 4. Write Usage Rights

Be specific about restrictions:

**Good:**
```
"Print on demand only. No resale of digital files. 
Licensed for distribution through Printful only.
No wholesale bulk orders without written approval."
```

**Bad:**
```
"All rights reserved" (too vague)
"No commercial use" (too restrictive for a product)
```

### 5. Create Verification URL

Set up placeholder:
```
https://owpil.com/verify/OWPIL-DUAL-HOODIE-001
```

(Implementation is future work; for now this is documentation)

### 6. Set Feature Flags

Plan for future tech:

```json
"qrEnabled": false,      // Will QR codes be printed on items?
"nfcEnabled": false,     // Will NFC chips be embedded?
"easEnabled": false,     // Will we use Ethereum Attestation Service?
"storyProtocolReady": false  // Will we register on Story Protocol?
```

### 7. Link in Product

Update `data/merch/products.json`:

```json
{
  ...
  "protected": true,
  "assetId": "OWPIL-DUAL-HOODIE-001"
}
```

### 8. Get Approval

Before publishing:
- Kuro prepares protection metadata
- Human reviews license language
- Human approves asset ID and restrictions
- Product goes live with "Protected" badge

## QR Code Integration (Future)

### Phase 1: QR Code Preparation (Q3 2026)

1. **Design verification page:**
   ```
   /verify/[assetId]
   
   Shows:
   - Asset ID
   - Product name
   - Creator name
   - Certificate of authenticity
   - License summary
   - Purchase batch info
   - Share / print options
   ```

2. **Generate QR code:**
   ```
   https://owpil.com/verify/OWPIL-DUAL-HOODIE-001
   ```

3. **Print on product:**
   - Provide QR image to Printful/Printify
   - Print on hang tag or packaging
   - Ensure QR is scannable (sufficient contrast, size)

### Phase 2: QR Code Activation

1. Customer receives product
2. Customer scans QR code with phone
3. Verification page loads
4. Customer sees full certificate and provenance
5. Optional: customer registers as buyer (anonymous email)

## NFC Integration (Future)

### Phase 1: NFC Planning (Q4 2026)

1. **Chip selection:**
   - NTAG216 or similar (cheap, ~$0.50–$1.00)
   - Encapsulation: waterproof, durable

2. **Placement:**
   - Inside product packaging
   - Embedded in premium apparel (future)
   - Woven into canvas frames (future)

3. **Data structure:**
   ```
   NFC Chip → HTTPS URL
   https://owpil.com/verify/nfc/[UNIQUE_CHIP_ID]
   
   Links to:
   - Asset ID verification page
   - Ownership record (if customer taps to register)
   - Purchase date and batch info
   ```

### Phase 2: NFC Activation

1. Customer taps NFC chip with smartphone
2. Verification page loads + buyer registration option
3. Creates immutable proof of authenticity
4. Enables secondary market trust (future)

## Story Protocol Integration (Future)

### Phase 1: Planning (2027 Q1)

1. **Assess Story Protocol:**
   - Does it support our use cases?
   - Cost structure?
   - Integration complexity?

2. **Design onchain records:**
   ```
   Product → Asset ID → Creator → Series → Chapter
   
   All registered on Story Protocol
   All queryable by anyone
   Immutable proof of provenance
   ```

3. **Get legal review:**
   - What claims can we make with onchain records?
   - Do they constitute legal protection?
   - IP registration requirements?

### Phase 2: Registration (2027 Q2+)

Only after legal approval:

1. Register creator (Tyshawn/O.W.P.I.L)
2. Register series (DUAL, O.W.P.I.L, Afformations)
3. Register products and asset IDs
4. Link to physical products via QR/NFC

## Common Issues

**Can I claim copyright with this?**  
No. Asset ID and QR code prove *provenance*, not copyright. Copyright is automatic and doesn't require registration in most countries. However, registration (USPTO, etc.) is separate.

**Can I use this to prevent counterfeits?**  
Partially. Made-to-order model prevents bulk counterfeiting. QR/NFC makes verification easy. But protection is probabilistic, not absolute. Determined counterfeiters can always try.

**What if someone steals my QR code design?**  
Made-to-order model makes large-scale counterfeiting uneconomical. Verification page can be updated to flag frauds. But QR codes are inherently copyable. This is why future layers (NFC, onchain) add security.

**Can I use this without legal approval?**  
Yes, as long as you don't claim legal protection. Asset ID is documentation. QR code is convenience. Neither implies copyright, trademark, or patent protection.

**What's the business case?**  
- Builds brand trust (proven authentic)
- Enables secondary market (future resale tracking)
- Prepares for premium product tiers
- Story Protocol potential (future onchain licensing)
- Artist toolkit for other creators

## Non-Negotiable Rules

1. **Artist attribution is permanent.** Every product shows creator name.
2. **License is clear.** Every product has explicit usage rights.
3. **No false claims.** Asset ID doesn't grant legal protection without explicit disclaimer.
4. **Verification is optional.** Customers don't have to register; verification is one-way.
5. **No selling without protection.** All products get asset IDs before going live.

---

**Skill Owner:** Kuro (O.W.P.I.L Store Agent)  
**Last Updated:** April 30, 2026  
**Collaboration:** Legal review required before QR/NFC/onchain phases
