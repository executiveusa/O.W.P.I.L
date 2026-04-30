# The Emerald Tablets of O.W.P.I.L Commerce

## Design Commandments for the Merch Store

These are not rules. They are principles. They exist to keep the studio in alignment as the merch store grows.

---

### I. Start with the Feature, Not the Shell

Build the **product experience first.** The store is a servant to the product, not the other way around.

**Bad:** "We need a store. What products should we add?"  
**Good:** "This product is incredible. How do we sell it?"

Every product begins with a question: *What does the customer need, and what story does it tell?*

---

### II. Make the Product Obvious

A visitor has 5 seconds to understand what they're looking at.

- **Product image:** Large, beautiful, cinematic. Show the product in use, not in a vacuum.
- **Product name:** Clear, memorable, searchable. "Dual Hero Hoodie" not "Chapter 1 Apparel Drop."
- **Price:** Immediate, no hiding. $88. Not "starting at" or "from."
- **One job:** Each product card has one job. Tell the visitor: *What is this, and why should I care?*

**The Test:** Show a product card to a stranger. They should know what it is in 3 seconds.

---

### III. Use Hierarchy Before Decoration

Information flows like this:

1. **What is it?** (Product name)
2. **How much?** (Price)
3. **Why should I care?** (1-line description)
4. **Tell me more.** (Full description, specs)
5. **I want it.** (CTA button)

Do not add:
- Unnecessary badges
- Confusing colors
- Animated distractions
- Multiple CTAs per card

**One card. One story. One clear next step.**

---

### IV. Use Fewer Choices

More products do not mean more sales. They mean more confusion.

**Rule:** Start with 10 core products. Only add #11 if #10 isn't working.

For collections:
- Show featured collections first (max 7)
- Hide niche filters until customer asks
- Let search and sort handle granularity

**Design question:** If you removed this product or filter, would anyone notice? If no, remove it.

---

### V. Every Product Must Have One Primary Action

No product card should offer:
- "Add to Cart" AND "Add to Wishlist" AND "Share" AND "Email Me"

**One action per card:**
- Live product: "View Product"
- Coming soon: "Notify Me"
- Digital: "Download" (future)
- Collector: "Request" (future)

Secondary actions live on the detail page, not the grid.

---

### VI. Every Image Must Sell the Product

Product images are not decorative. They are sales tools.

**Requirements:**
- Shot in lifestyle context (on a person, in a room, in use)
- Cinematic lighting (dramatic, not flat)
- Shows the product and the feeling it creates
- Consistent visual language across the store
- High resolution (3000px+ for print quality)

**The Test:** Can this image work as a poster? If yes, it's strong enough for the store.

---

### VII. Every Store Section Must Answer Three Questions

### What is it?
A headline and icon answer this instantly.

Example: "DUAL: Chapter 1 — The Knock"

### Why does it matter?
One sentence of context or benefit.

Example: "Printed only when ordered. No waste. Protected artwork."

### What do I do next?
One clear CTA.

Example: "Shop the Drop" or "Learn How Protection Works"

**No section without these three.**

---

### VIII. Print Only After Purchase

This is not a design rule. This is a philosophy.

**Why made-to-order?**
- Zero inventory waste
- Zero counterfeiting (digital products are pre-printed, physical is made when ordered)
- Sustainable
- Forces product quality (can't hide behind bulk discounts)
- Cashflow friendly (customer pays before production)

**Never offer:**
- "Pre-order and save 10%"
- "Order now, we'll print later"
- Bulk inventory sitting in a warehouse

**Always offer:**
- "Printed when you order"
- "Made to order, shipped in 5-7 days"
- "No waste, no inventory"

---

### IX. Protect the Art Before Scaling the Product

Do not sell 1,000 hoodies before you've protected the artwork.

**Sequence:**
1. Product is designed
2. Asset ID is assigned
3. Protection metadata is created
4. QR code / verification is prepared
5. Product is listed for sale

**DO NOT:**
- List a product without an asset ID
- Use unattributed artwork
- Sell without knowing who owns the copyright
- Skip the protection step to ship faster

---

### X. Make the Agent Reusable

Kuro is one agent. Eventually, there may be more (Aura for social, Nyx for partnerships, etc.).

**Structure so future agents can:**
- Understand the product graph without rereading the code
- Add products by updating JSON (not touching React)
- Check brand consistency against documented principles
- Hand off to humans at the right decision points
- Never override artist rights

**Store data in JSON, not code.** Store philosophy in markdown, not comments.

---

## Application

These ten principles guide every decision in the merch store.

**Adding a product?** Check principle VI (image sells). Check principle VII (answer three questions). Check principle IX (protect first).

**Redesigning the grid?** Check principle II (obvious). Check principle IV (fewer choices). Check principle V (one primary action).

**Writing copy?** Check principle III (hierarchy). Check principle VII (three questions). Check principle VIII (made-to-order emphasis).

**Building a new feature?** Check principle I (feature first). Check principle X (reusable by future agents).

## Non-Negotiable

These are hard stops. There is no workaround.

**Do not sell without artist attribution visible.**  
**Do not list a product without an asset ID.**  
**Do not implement payment without human approval.**  
**Do not claim legal protection without legal review.**  
**Do not multiply vendors without strategic reason.**  
**Do not add products just to add products.**

---

**Keeper of These Tablets:** Kuro (O.W.P.I.L Store Agent)  
**Carved:** April 30, 2026  
**Stone:** Principles, not rules. Spirit over letter.
