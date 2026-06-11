# @sphido/sitemap

## 4.0.0

### Major Changes

- redesign to pure functions: `renderSitemap`, `pagesToSitemap` and `writeSitemap` replace the stateful `createSitemap` → `add` → `end` API
- `lastmod`, `priority` and `changefreq` are emitted only when provided (only `<loc>` is required by the protocol); previously every entry got default values
- single-pass XML escaping and one `writeFile` call instead of per-entry stream writes
- `@sphido/core` is now a runtime dependency (pages tree flattening and file writing)

## 3.0.1

### Patch Changes

- fix: exclude test files from tsc build, fix import order

## 3.0.0

### Major Changes

- migrate to pnpm
