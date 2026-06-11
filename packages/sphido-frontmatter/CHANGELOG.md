# @sphido/frontmatter

## 3.1.0

### Minor Changes

- export `WithFrontmatter` type for composing typed pages (`Page & WithFrontmatter`)

### Patch Changes

- a leading HTML comment is treated as front matter only when it contains a YAML mapping; plain comments and comments with invalid YAML stay in the content
- ship LICENSE in the npm tarball, `exports` with explicit types condition, `sideEffects: false`, `repository.directory`

## 3.0.0

### Major Changes

- migrate to pnpm

### Patch Changes

- Updated dependencies
  - @sphido/core@3.0.0
