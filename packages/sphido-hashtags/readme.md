# @sphido/hashtags

Searches Markdown for hashtags and replaces them with links in the format `[#hashtag](/tag/hashtag)`.

## Install

```bash
pnpm add @sphido/hashtags
```

## API

### `getHashtags(content)`

The `getHashtags()` function searches the string for all hashtags and returns them as an array. The input `content`
parameter is expected to be in Markdown format. The function automatically skips preformatted text in Markdown syntax.

```javascript
import { getHashtags } from '@sphido/hashtags';

const tags = getHashtags('#one #two #three `color: #red`');
console.log(tags); // will be ['#one', '#two', '#three']; 
```

### `tagsToMarkdown(content, tags = [], options?)`

The `tagsToMarkdown()` function expects at least two input parameters — `content` and `tags`. It replaces hashtags with
Markdown syntax for links in the format `[#hash](/tag/hash)`.

```javascript
import { getPages, allPages, readFile } from '@sphido/core';
import { getHashtags, tagsToMarkdown } from '@sphido/hashtags';

const pages = await getPages({path: 'content'});

for (const page of allPages(pages)) {
	page.content = await readFile(page.path);
	page.tags = getHashtags(page.content);

	page.content = tagsToMarkdown(page.content, page.tags);
}
```

### `hashtags(page, dirent)`

The `hashtags()` function searches for all hashtags in `page.content`. If the `page.content` property is empty, the function
will automatically load the file content. All found tags are then stored in the `page.tags` property as a `Set`. The
function also automatically replaces hashtags with Markdown syntax for links in the format `[#hash](/tag/hash)`.

```javascript
import { getPages, allPages } from '@sphido/core';
import { hashtags } from '@sphido/hashtags';

const pages = await getPages({path: 'content'}, hashtags);

for (const page of allPages(pages)) {
	console.log(page.tags, page.content);
}
```

## TypeScript

The package exports a `WithHashtags` type describing the field the `hashtags` extender adds:

```typescript
import { getPages, type Page } from '@sphido/core';
import { hashtags, type WithHashtags } from '@sphido/hashtags';

type BlogPage = Page & WithHashtags;

const pages = await getPages<BlogPage>({path: 'content'}, hashtags);
// pages[0].tags is Set<string> | undefined
```

```typescript
type WithHashtags = {
	tags?: Set<string>;
};
```

When combined with the `@sphido/frontmatter` extender (which may read `tags` as a `string[]` from
the YAML block), the runtime merges both into a single `Set` — `hashtags` spreads any existing
`page.tags` value into the `Set` it creates, so frontmatter tags and content hashtags end up together.

## Source code

[@sphido/hashtags](https://github.com/sphido/sphido/tree/main/packages/sphido-hashtags)