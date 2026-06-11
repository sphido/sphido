# @sphido/feed

## 1.0.1

### Patch Changes

- no code changes; version 1.0.0 is permanently blocked on npm because the package name was published and unpublished in 2024

## 1.0.0

### Major Changes

- initial release: RSS 2.0 feed generator with pure functions `renderFeed(channel, items)` and `writeFeed(file, xml)`, matching the `@sphido/sitemap` v4 API shape
- RFC 822 dates via `Date#toUTCString()`, `lastBuildDate` from the newest item, `<guid isPermaLink="true">`, optional `<atom:link rel="self">` when `feedUrl` is given, single-pass XML escaping
- throws `TypeError` on missing channel `title`/`link`/`description` and on items without a valid `date`
