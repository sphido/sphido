# @sphido/dev

## 1.0.1

### Patch Changes

- no code changes, the published files are identical to 1.0.0; first release through CI, which validates the npm trusted publisher (the `@types/node` dev dependency moved to `^26.6.6`)

## 1.0.0

### Major Changes

- initial release: watch mode and dev server with live reload (`serve()` — `fs.watch` based rebuilds, static server over the output directory, SSE live reload, zero runtime dependencies)
