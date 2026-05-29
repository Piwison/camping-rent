# Booking ends at Enquiry — no payment, accounts, or real-time availability

The MVP **Booking** flow captures trip dates, selected gear, and contact
details, then ends at "Submit **Enquiry**". There is no online payment, no
customer accounts, and no real-time availability check. The **Vendor** confirms
each Enquiry offline within 24 hours.

This trades a frictionless, fully-transactional store for speed to launch and a
manual confirmation loop the Vendor can run by hand at low volume.

## Consequences

- No deposit/payment, auth, or availability calendar code in the MVP — these
  are deferred to later phases.
- The booking total is informational; it is validated server-side
  (`validateEnquiry`) but never charged.
