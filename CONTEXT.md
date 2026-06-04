# Basecamp & Co.

The domain glossary for Basecamp & Co. — a glamping gear rental service for
Taiwan's **Weekend Escapist**. This file defines the language of the domain and
nothing else: no implementation details, no roadmap. For decisions see
`docs/adr/`; for the build plan see `ROADMAP.md`.

## Language

### Positioning & people

**Glamping**:
Camping that prioritises aesthetic comfort and design over survival skill. Happens at real campsites with real gear, curated for visual and lifestyle appeal. The lens for every product decision: "does this feel glamping?"
_Avoid_: luxury camping, resort camping (those imply resorts, not campsites).

**Weekend Escapist**:
The primary customer persona — an urban professional aged 28–35 in Taiwan who wants a beautiful outdoor experience without owning gear, and treats camping as an aesthetic experience.
_Avoid_: user, client, customer (when you mean this persona specifically).

### Catalog

**Item**:
An individual piece of gear available to rent on its own — a tent, a chair, a lantern. Priced per **Weekend** day in **TWD**. Belongs to one **Category**.
_Avoid_: product, SKU, gear (when you mean a single rentable unit).

**Bundle**:
A pre-curated set of **Items** sold as a single rental unit at a fixed **Weekend** price. Has one of three **Tiers**.
_Avoid_: package, kit, set.

**Catalog**:
The full collection of **Items** and **Bundles** available to rent.

**Category**:
The classification of an **Item**: `shelter`, `furniture`, `kitchen`, `lighting`, `bedding`, or `other`. Used to filter the catalog.
_Avoid_: type, group, tag.

**Tier**:
The level of a **Bundle**, one of three: `solo` ("Solo Escape", 1 person, minimal), `standard` ("Camp Set", 2 persons, full setup), `deluxe` ("Full Grounds", 2–4 persons, complete glamping setup).
_Avoid_: level, grade, plan.

### Booking

**Weekend**:
The standard rental period — Friday check-in to Sunday check-out, 2 nights. The default date selection in the **Booking** flow. **Bundle** prices are expressed per Weekend.

**Booking**:
A customer's rental enquiry capturing trip dates, selected **Items**/**Bundles**, and contact details. A Booking ends when the customer submits the **Enquiry** — there is no payment in the flow. A Booking *produces* **Reservations**, but is not itself one.
_Avoid_: order, cart, checkout (and don't use **Reservation** as a synonym — that's the per-Item stock hold).

**Enquiry**:
The submission that completes a **Booking**: the captured trip details sent to the gear owner, who confirms offline. Pricing is honoured by the rule that **Bundles** are a flat Weekend price while **Items** are charged per night.
_Avoid_: request, lead, message, form.

**Vendor**:
The gear owner who fulfils Bookings and manages the **Catalog**.
_Avoid_: admin, seller, merchant, supplier.

**Account**:
A **Weekend Escapist**'s saved identity (email + password). Signing in links new **Bookings** to them so they can see their history; booking as a guest stays possible. Anyone signed in who is not the **Vendor** holds an Account.
_Avoid_: login, profile, membership.

**Review**:
A signed-in **Account** holder's star rating (1–5) and optional note, attached to an **Item**, a **Bundle**, or the overall experience. Auto-published — no **Vendor** approval. Per-gear Reviews show on the Catalog detail pages; experience Reviews show as testimonials on the home page.
_Avoid_: rating (alone), comment, feedback, testimonial (as the data type — that's just how experience Reviews are displayed).

### Availability

**Stock**:
How many units of an **Item** the **Vendor** owns and can rent at once. Drives **Availability**. The Vendor sets it per Item in the dashboard.
_Avoid_: inventory, quantity on hand.

**Reservation**:
A hold on a number of units of an **Item** for a specific **Weekend**, created when a **Booking** is submitted. Distinct from the **Booking** itself: one Booking produces a Reservation for each Item it needs (a **Bundle** reserves each of its component Items). A Reservation is `held` while the Enquiry is pending, `confirmed` when the Vendor confirms, or `released` when cancelled.
_Avoid_: hold, lock, allocation.

**Availability**:
How many units of an **Item** — or complete sets of a **Bundle** — are free for a given **Weekend**: **Stock** minus the units already held by overlapping **Reservations**. A Bundle's availability is limited by its scarcest component Item.
_Avoid_: vacancy, openings, capacity.

### Money

**TWD (NT$)**:
New Taiwan Dollar. All pricing is in TWD, formatted as `NT$X,XXX`. The only currency on the platform.

## Example dialogue

> **Dev:** When a Weekend Escapist adds the Camp Set to their Booking, do we
> charge per night like the other gear?
>
> **Owner:** No — that's a Bundle, so it's a flat Weekend price. Only
> individual Items are per-night.
>
> **Dev:** And once they hit submit?
>
> **Owner:** That's the Enquiry. There's no payment — it lands with the Vendor,
> who confirms offline. The Booking is "done" the moment the Enquiry is sent.
