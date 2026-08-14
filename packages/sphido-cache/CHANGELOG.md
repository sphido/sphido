# @sphido/cache

## 1.0.0

### Major Changes

- initial release: `changed(page)` answers whether a page needs rebuilding, `writeCache()` persists the state atomically after a successful build, `removed()` lists sources that disappeared, `resetCache()` drops the in-memory state
- two strategies — `mtime` (one `stat` per page, the default) and `hash` (SHA-1 of the content) — plus a global `version` key for invalidating every page when a layout changes; no third-party dependencies
