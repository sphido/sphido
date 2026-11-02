# @sphido/collections

## 1.0.1

### Patch Changes

- `siblings` reads the neighbouring pages with `?? null` instead of bounds checks, so it type-checks under `noUncheckedIndexedAccess`; behavior unchanged

## 1.0.0

### Major Changes

- initial release with `sortBy`, `paginate`, `groupByTag` and `siblings` helpers (closes [#44](https://github.com/sphido/sphido/issues/44))
