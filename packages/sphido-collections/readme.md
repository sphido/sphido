# @sphido/collections

Small pure helpers over the Sphido pages tree: sorting, pagination, tag pages and prev/next navigation. Zero runtime
dependencies — just functions, in the spirit of Sphido. Pairs with [`@sphido/hashtags`](https://github.com/sphido/sphido/tree/main/packages/sphido-hashtags)
for generating `/tag/...` pages.

## Install

```bash
pnpm add @sphido/collections
```

## API

### `sortBy(pages, selector, direction = 'asc')`

Stable sort by the selector result (`string | number | Date`). Pages where the selector returns `undefined` always go
last, regardless of direction. Returns a **new** array — the input is never mutated.

```javascript
import { sortBy } from '@sphido/collections';

const posts = sortBy(pages, (page) => page.date, 'desc'); // newest first
const alphabetical = sortBy(pages, (page) => page.title);
```

### `paginate(pages, perPage)`

Splits pages into chunks of `perPage` items and returns `Array<{items, page, total, prev, next}>`. `page` is 1-based;
`prev` and `next` are page numbers or `null` at the boundaries. Empty input returns an empty array. Throws a
`RangeError` when `perPage < 1`.

```javascript
import { paginate } from '@sphido/collections';

for (const { items, page, total, prev, next } of paginate(posts, 10)) {
	console.log(`page ${page}/${total}`, items.length, { prev, next });
}
```

### `groupByTag(pages, key = 'tags')`

Groups pages by tag into a `Map<string, Page[]>` with keys sorted by tag name. Accepts both a `Set` (as produced by the
`hashtags` extender) and an array (as produced by frontmatter) on the page; pages without the key are skipped.

```javascript
import { groupByTag } from '@sphido/collections';

for (const [tag, tagged] of groupByTag(posts)) {
	console.log(tag, tagged.map((page) => page.title));
}
```

### `siblings(pages, page)`

Returns `{prev, next}` for a page within the given ordered array, matched by identity. Either side is `null` at the
boundaries; if the page is not found, both are `null`.

```javascript
import { siblings } from '@sphido/collections';

const { prev, next } = siblings(posts, page);
```

## Recipe: blog with tag pages and pagination

A complete blog index with pagination, `/tag/<tag>/` pages and prev/next links in the article footer — no custom
utility code needed:

```javascript
import { getPages, allPages, writeFile } from '@sphido/core';
import { hashtags } from '@sphido/hashtags';
import { sortBy, paginate, groupByTag, siblings } from '@sphido/collections';

const pages = await getPages({ path: 'content' }, hashtags);

// 1. All posts, newest first
const posts = sortBy([...allPages(pages)], (page) => page.date, 'desc');

// 2. Paginated blog index: /index.html, /page/2/index.html, ...
for (const { items, page, total, prev, next } of paginate(posts, 10)) {
	const list = items.map((post) => `- [${post.name}](/${post.name}/)`).join('\n');
	const nav = [
		prev ? `[← newer](${prev === 1 ? '/' : `/page/${prev}/`})` : '',
		next ? `[older →](/page/${next}/)` : '',
	].join(' ');

	await writeFile(
		page === 1 ? 'public/index.html' : `public/page/${page}/index.html`,
		`<main>${list}</main><nav>${nav} (${page}/${total})</nav>`,
	);
}

// 3. Tag pages: /tag/<tag>/index.html (targets of the links @sphido/hashtags generates)
for (const [tag, tagged] of groupByTag(posts)) {
	const list = tagged.map((post) => `- [${post.name}](/${post.name}/)`).join('\n');
	await writeFile(`public/tag/${tag}/index.html`, `<h1>#${tag}</h1><main>${list}</main>`);
}

// 4. Article pages with prev/next navigation in the footer
for (const post of posts) {
	const { prev, next } = siblings(posts, post);
	const footer = [
		prev ? `[← ${prev.name}](/${prev.name}/)` : '',
		next ? `[${next.name} →](/${next.name}/)` : '',
	].join(' ');

	await writeFile(`public/${post.name}/index.html`, `<article>${post.content}</article><footer>${footer}</footer>`);
}
```

Need just the latest N posts? Plain `posts.slice(0, n)` is all it takes — no wrapper needed.

## Source code

[@sphido/collections](https://github.com/sphido/sphido/tree/main/packages/sphido-collections)
