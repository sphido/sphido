# @sphido/core

## 3.1.0

### Minor Changes

- generic Page typing: `getPages<T>`, `allPages<T>`, `Pages<T>`, `ExtenderCallback<T>`, `Extenders<T>` and `ExtenderObject` — defaults keep existing call sites compiling unchanged
- `IncludePage` returns `boolean`, `Options.path` is `string`, extender callbacks may be synchronous

### Patch Changes

- ship LICENSE in the npm tarball, `exports` with explicit types condition, `sideEffects: false`, `repository.directory`

## 3.0.0

### Major Changes

- migrate to pnpm
