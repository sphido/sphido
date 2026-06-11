# @sphido/frontmatter

[Front matter](https://jekyllrb.com/docs/front-matter/) is an optional section of valid YAML that is placed at the top
of a page and is used for maintaining metadata for the page and its contents. `@sphido/frontmatter` is a `page` extender
that processes these blocks inside `page.content`. Using the fastest Node.js YAML
Parser [js-yaml](https://github.com/nodeca/js-yaml).

## Install

```bash
pnpm add @sphido/frontmatter
```

## Example

```javascript
#!/usr/bin/env node

import { getPages, allPages } from '@sphido/core';
import { frontmatter } from '@sphido/frontmatter';

const pages = await getPages({path: 'content'}, frontmatter);

for (const page of allPages(pages)) {
	console.log(page)
}
```

## How to add front matter block

* Must be first in the file
* Must be valid YAML
* Can be closed between triple-dashed lines `---` and `---` or HTML comments `<!-- -->`

```markdown
---
title: Page title
tags: [one, two, other]
---

# Content

Lorem ipsum...
```

or

```markdown
<!--
title: Page title
tags: [one, two, other]
-->

# Content

Lorem ipsum...
```

## TypeScript

The package exports a `WithFrontmatter` type describing the fields the extender commonly adds:

```typescript
import { getPages, type Page } from '@sphido/core';
import { frontmatter, type WithFrontmatter } from '@sphido/frontmatter';

type BlogPage = Page & WithFrontmatter;

const pages = await getPages<BlogPage>({path: 'content'}, frontmatter);
// pages[0].title is string | undefined, pages[0].date is string | Date | undefined, ...
```

```typescript
type WithFrontmatter = {
	title?: string;
	description?: string;
	date?: string | Date;
	tags?: string[];
	slug?: string;
	fmParseError?: string;
};
```

`WithFrontmatter` is intentionally a closed type — arbitrary YAML keys from your front matter
blocks still land on the page at runtime via the `Page` index signature (typed `any`). If you rely
on additional keys, intersect your own type: `type BlogPage = Page & WithFrontmatter & { author?: string }`.

## Source code

[@sphido/frontmatter](https://github.com/sphido/sphido/tree/main/packages/sphido-frontmatter)