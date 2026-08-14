# @sphido/cache

Incremental builds for Sphido: one question — *has this page changed since the last build?* — so a rebuild costs what
changed, not what the site contains. No third-party dependencies; `fs.stat` and, if you ask for it, SHA-1.

## Install

```bash
pnpm add @sphido/cache
```

## Example

```javascript
#!/usr/bin/env node

import { allPages, getPages, writeFile } from '@sphido/core';
import { frontmatter } from '@sphido/frontmatter';
import { markdown } from '@sphido/markdown';
import { changed, writeCache } from '@sphido/cache';
import { layout } from './layout.js';

const pages = await getPages({path: 'content'}, frontmatter, markdown());

for (const page of allPages(pages)) {
	page.output = `public/${page.name}.html`;

	if (!(await changed(page))) continue; // output is up to date

	await writeFile(page.output, layout(page));
}

await writeCache(); // only after the build got this far
```

State lives in `.sphido/cache.json` — add it to `.gitignore`.

## API

### `changed(page, options?): Promise<boolean>`

`true` when the page has to be rebuilt: its source is new or newer, the state is unknown, the source cannot be read, or
— when `page.output` is already set — the output file is missing. Recording the page's state is a side effect, so
`writeCache()` persists exactly the pages the build looked at.

Set `page.output` **before** calling `changed()` and a deleted output brings the page back, so `rm -rf public` followed by
a rebuild regenerates the site instead of trusting a cache that is right about sources and wrong about results.

### `writeCache(options?): Promise<void>`

Persists what `changed()` collected, atomically (temporary file plus rename, so an interrupted build cannot leave a
truncated cache). Call it **after** a successful build — a half-written site with a fully-written cache skips the rest
forever.

In a long-lived process such as `@sphido/dev`, the state written becomes what the next rebuild compares against.

### `removed(options?): string[]`

Paths the previous build recorded and this one never saw — sources that are gone while their outputs are not. Call it
before `writeCache()`, which forgets the previous state:

```javascript
import { unlink } from 'node:fs/promises';
import { removed, writeCache } from '@sphido/cache';

for (const path of removed()) {
	await unlink(path.replace('content', 'public').replace(/\.md$/, '.html')).catch(() => {});
}

await writeCache();
```

### `resetCache(options?): void`

Forgets the in-memory state for a cache file; the next `changed()` reads it from disk again. Useful in tests.

### Options

```javascript
changed(page, {
	file: '.sphido/cache.json',  // where the state is persisted
	strategy: 'mtime',           // 'mtime' | 'hash'
	version: undefined,          // global key — change it to invalidate every page
})
```

Pass the same options to `changed()`, `removed()` and `writeCache()`; each cache file keeps its own state.

## Strategies

| | `mtime` (default) | `hash` |
|---|---|---|
| Reads | `fs.stat` — `mtimeMs` + `size` | the whole file, SHA-1 |
| Notices | any write, including `touch` | content changes only |
| Cost per page | one stat | one read |
| Blind to | a rewrite that preserves mtime and size | nothing |

`mtime` is the default because a build that rebuilds too much is merely slow, while one that rebuilds too little ships
stale HTML — and after a `git checkout` or a `cp -r`, mtimes move even when content does not, which errs the safe way.
Reach for `hash` when your content is generated or copied around and you want writes that changed nothing to stay free.

## Invalidating everything

The cache tracks content sources, not your templates. Change `layout.js` and every page needs rebuilding, so hand its
state to `version`:

```javascript
import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';

const version = createHash('sha1')
	.update(await readFile('layout.js'))
	.update(await readFile('build.js'))
	.digest('hex');

if (!(await changed(page, {version}))) continue;
```

A different `version` — or a different `strategy`, a missing file, unparseable JSON — leaves every page changed. Errors
always fall that way: a rebuild too many, never a page too few.

## With `@sphido/dev`

`@sphido/dev` calls your `build()` on every save, so caching is something `build()` opts into — nothing to configure:

```javascript
// build.js
export async function build() {
	const pages = await getPages({path: 'content'}, frontmatter, markdown());

	for (const page of allPages(pages)) {
		page.output = `public/${page.name}.html`;
		if (!(await changed(page, {version}))) continue;
		await writeFile(page.output, layout(page));
	}

	await writeCache({version});
}
```

```javascript
// dev.js
import { serve } from '@sphido/dev';
import { build } from './build.js';

await serve({watch: ['content'], output: 'public', build});
```

The first rebuild after a save writes one page instead of all of them, and the state stays in memory between rebuilds —
no re-reading the cache file per keystroke.

## Numbers

1 000 markdown pages (3.9 MB), rendered through `@sphido/markdown` and written to disk. macOS on Apple silicon,
Node.js 26, median of three runs:

| | time | pages built |
|---|---|---|
| full build, no cache | 153 ms | 1 000 |
| no-op rebuild, `mtime` | **21 ms** | 0 |
| no-op rebuild, `hash` | 60 ms | 0 |
| rebuild after editing one page | 21 ms | 1 |

A no-op rebuild is 7× faster with `mtime`, and the gap widens with page count — the cached path is one `stat` per page
while the uncached one parses and writes every file.

## TypeScript

```typescript
import type { CacheOptions, CacheStrategy } from '@sphido/cache';
```

## Source code

[@sphido/cache](https://github.com/sphido/sphido/tree/main/packages/sphido-cache)
