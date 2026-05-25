# Basecamp & Co. — Domain Glossary

## Glossary

### Glamping
**Definition:** The target experience category. A portmanteau of "glamorous" and "camping." Refers to camping that prioritises aesthetic comfort and design over survival skill. Not the same as luxury camping (resorts) — glamping happens at real campsites, with real gear, but curated for visual and lifestyle appeal.
**Scope:** The core positioning of the entire product. Every design and product decision should ask "does this feel glamping?"

### Weekend Escapist
**Definition:** The primary customer persona. An urban professional aged 28–35 in Taiwan who wants a beautiful outdoor experience without owning gear. Comfortable spending NT$3,000–4,500 for a weekend trip. Follows design accounts, has stayed in boutique hotels, and treats camping as an aesthetic experience.
**Scope:** All copy, UX flows, and product decisions should be optimised for this persona.

### Bundle
**Definition:** A pre-curated set of gear items sold as a single rental unit at a discounted weekend price. Bundles have three tiers: Solo, Standard (Camp Set), and Deluxe (Full Grounds). Bundle pricing is fixed per weekend (Fri–Sun), not per day.
**Contrast:** Different from an individual Item, which is priced per day.

### Item
**Definition:** An individual piece of gear available to rent separately (e.g., a tent, a chair, a lantern). Priced in TWD per day. Customers can rent items standalone or add them to a Bundle.
**Contrast:** Different from a Bundle, which has a fixed weekend price.

### Weekend
**Definition:** The standard rental period. Friday check-in to Sunday check-out (2 nights). The default date selection in the booking flow. Bundle prices are expressed per weekend.

### TWD (NT$)
**Definition:** New Taiwan Dollar. All pricing on the platform is in TWD, formatted as `NT$X,XXX`.

### Booking
**Definition:** A customer's rental enquiry that captures: trip dates, selected items/bundles, and contact details. In MVP, a Booking ends at "Submit Enquiry" — no payment is processed. Confirmation happens offline within 24 hours.
**Scope:** The MVP booking flow does not include payment, accounts, or real-time availability.

### Vendor Dashboard
**Definition:** An admin interface for the gear owner to manage the catalog (add/edit/remove items, set availability, upload photos). **Phase 2 only** — not part of MVP. In MVP, catalog is managed via `/data/gear.ts`.

### Category
**Definition:** A classification for individual gear Items. Values: `shelter`, `furniture`, `kitchen`, `lighting`, `bedding`, `other`. Used for filtering on the Gear Catalog page.

### Tier
**Definition:** The three bundle levels: `solo` (1 person, minimal), `standard` (2 persons, full setup), `deluxe` (2–4 persons, complete glamping setup). Displayed as "Solo Escape", "Camp Set", and "Full Grounds".
