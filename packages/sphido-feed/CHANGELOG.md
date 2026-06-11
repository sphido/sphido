# @sphido/feed

## 3.1.0

### Patch Changes

- no code changes; the @sphido/feed name was published 2019–2024 and unpublished, which permanently blocks versions 0.0.1–0.0.8, 1.0.0–1.0.10 and 1.1.0 on npm — 3.1.0 aligns with the current @sphido/core release line

## 1.0.0

### Major Changes

- initial release: RSS 2.0 feed generator with pure functions `renderFeed(channel, items)` and `writeFeed(file, xml)`, matching the `@sphido/sitemap` v4 API shape
- RFC 822 dates via `Date#toUTCString()`, `lastBuildDate` from the newest item, `<guid isPermaLink="true">`, optional `<atom:link rel="self">` when `feedUrl` is given, single-pass XML escaping
- throws `TypeError` on missing channel `title`/`link`/`description` and on items without a valid `date`
