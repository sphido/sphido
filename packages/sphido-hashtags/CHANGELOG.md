# @sphido/hashtags

## 3.1.0

### Minor Changes

- export `WithHashtags` type for composing typed pages (`Page & WithHashtags`)
- `getHashtags` returns `string[]` instead of `RegExpMatchArray | null`

### Patch Changes

- inline tags merge with existing `page.tags` (e.g. from frontmatter) instead of overwriting them
- tags match longest-first with a word boundary, so `#go` no longer splits `#golang`; code spans and fenced blocks are left untouched by link replacement
- ship LICENSE in the npm tarball, `exports` with explicit types condition, `sideEffects: false`, `repository.directory`

## 3.0.0

### Major Changes

- migrate to pnpm

### Patch Changes

- Updated dependencies
  - @sphido/core@3.0.0
