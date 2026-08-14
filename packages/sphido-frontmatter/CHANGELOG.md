# @sphido/frontmatter

## 3.1.1

### Patch Changes

- YAML dates land on the page as `Date` again: js-yaml 5 dropped the timestamp type from its default schema, so `date: 2018-09-11` had started arriving as a string. The extender now loads with the core schema plus `timestampTag`, which leaves the rest of the parsing untouched (`y` stays `"y"`, `0755` stays `755`).

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
