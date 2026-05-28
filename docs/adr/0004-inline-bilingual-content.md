# Bilingual content is stored inline on each record, not via an i18n framework

EN / 中文 copy for the **Catalog** is stored as paired fields on each record
(`name` / `nameChinese`, `description` / `descriptionChinese`) rather than
through an i18n library with locale resource bundles. With exactly two locales
and a small, owner-authored catalog, paired fields keep both languages
together, type-checked, and edited in one place.

## Consequences

- Adding a third locale, or translating chrome/UI strings (not just catalog
  copy), would mean revisiting this — it does not generalise to many locales.
- There is no locale-switching runtime; surfaces render both languages or pick
  one explicitly.
