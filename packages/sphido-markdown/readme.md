# @sphido/markdown

A `page` extender that renders `page.content` from markdown to HTML, so a Sphido site no longer has to hand-roll a
markdown call in its build loop. Built on [Sätteri](https://satteri.bruits.org/) — Markdown parsed and compiled in Rust,
plugins written in JavaScript — with GFM and a safe-by-default output out of the box.

## Install

```bash
pnpm add @sphido/markdown
```

## Example

```javascript
#!/usr/bin/env node

import { allPages, getPages } from '@sphido/core';
import { frontmatter } from '@sphido/frontmatter';
import { hashtags } from '@sphido/hashtags';
import { markdown } from '@sphido/markdown';

const pages = await getPages({path: 'content'}, frontmatter, hashtags, markdown());

for (const page of allPages(pages)) {
	console.log(page.content); // HTML
}
```

`markdown()` is a factory — it takes options and returns the extender. Put it **last**: every extender that works with
markdown (front matter, hashtags, your own) has to run before the HTML exists.

Content is loaded from `page.path` when it isn't in memory yet, the same way the front matter and hashtags extenders do
it. Directories are skipped, and so is anything that isn't a markdown file — a hand-written `content/index.html` page
reaches the output untouched.

## What zero config gives you

* **GFM** — tables, task lists, strikethrough, autolinks, footnotes
* **Raw HTML escaped** — `<script>alert(1)</script>` in a markdown file renders as text, not as a script
* **Links limited to known protocols** — `http`, `https`, `mailto`, `tel`; a `javascript:` or `data:text/html` URL loses
  its `href`/`src` and keeps only the link text
* **Front matter stripped** — a leading `--- ... ---` or `+++ ... +++` block never leaks into the HTML
* **Code blocks ready for a highlighter** — `<pre><code class="language-javascript">`, which is what Shiki,
  highlight.js and Prism expect, at build time or in the browser

## Options

```javascript
markdown({
	allowHtml: false,                    // keep raw HTML instead of escaping it
	allowedProtocols: ['http', 'https', 'mailto', 'tel'], // or false to allow every protocol
	features: {smartPunctuation: true},  // Sätteri parser features
	mdastPlugins: [],                    // Sätteri markdown-AST plugins
	hastPlugins: [],                     // Sätteri HTML-AST plugins
	sanitize: (html, page) => html,      // post-process the rendered HTML
	render: (markdown, page) => html,    // replace the engine altogether
	include: (dirent) => dirent.name.endsWith('.md'), // which files to render
})
```

Both safe defaults are ordinary hast plugins (`escapeRawHtml` and `safeUrls()`, both exported) placed **before** your
own, so a plugin of yours can still emit raw HTML — a syntax highlighter, for instance.

### Syntax highlighting at build time

```javascript
import { markdown } from '@sphido/markdown';
import { createHighlighter } from 'shiki';

const highlighter = await createHighlighter({themes: ['github-light'], langs: ['javascript']});

const shiki = {
	name: 'shiki',
	element: {
		filter: ['pre'],
		visit(node, ctx) {
			const code = node.children?.[0];
			if (code?.type !== 'element' || code.tagName !== 'code') return;
			const lang = (code.properties?.className ?? []).map(String)
				.find((name) => name.startsWith('language-'))?.slice(9);
			ctx.replaceNode(node, {
				type: 'raw',
				value: highlighter.codeToHtml(ctx.textContent(node), {
					lang: highlighter.getLoadedLanguages().includes(lang) ? lang : 'text',
					theme: 'github-light',
				}),
			});
		},
	},
};

const pages = await getPages({path: 'content'}, markdown({hastPlugins: [shiki]}));
```

### Heading anchors

```javascript
import slugify from '@sindresorhus/slugify';

const anchors = {
	name: 'heading-anchors',
	element: {
		filter: ['h2', 'h3'],
		visit(node, ctx) {
			const id = slugify(ctx.textContent(node));
			ctx.setProperty(node, 'id', id);
			ctx.prependChild(node, {
				type: 'element',
				tagName: 'a',
				properties: {className: ['anchor'], href: `#${id}`},
				children: [{type: 'text', value: '#'}],
			});
		},
	},
};
```

A plugin object is reused for every page. When yours needs per-page state — a slug counter that has to reset, say — pass
a factory instead and Sätteri calls it once per document: `hastPlugins: [() => anchors()]`.

### Raw HTML and a real sanitizer

Escaping is the whole of the default protection, so it is on until you turn it off. If your content needs raw HTML,
allow it and hand the output to a sanitizer:

```javascript
import DOMPurify from 'isomorphic-dompurify';

markdown({
	allowHtml: true,
	sanitize: (html) => DOMPurify.sanitize(html),
})
```

`sanitize` runs on whatever came out of the renderer, including a custom `render`.

### Another engine

`render` replaces Sätteri entirely — the rest of the extender (file loading, directory and non-markdown skipping,
`sanitize`) keeps working:

```javascript
import { marked } from 'marked';

markdown({render: (md) => marked.parse(md)})
```

```javascript
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkRehype from 'remark-rehype';
import rehypeSanitize from 'rehype-sanitize';
import rehypeStringify from 'rehype-stringify';

const processor = unified().use(remarkParse).use(remarkGfm).use(remarkRehype)
	.use(rehypeSanitize).use(rehypeStringify);

markdown({render: async (md) => String(await processor.process(md))})
```

## Why Sätteri

Measured on this repository before the package was written — macOS on Apple silicon, Node.js 26, 1 000 blog-shaped
markdown pages (3.9 MB corpus: headings, paragraphs, lists, a GFM table, a fenced code block, a quote), median of three
runs, each engine installed into its own empty project:

| GFM → HTML | installed size | packages | 1 000 pages | whole process |
|---|---|---|---|---|
| marked 18.0.9 | 480 kB | 1 | 45 ms | 0.10 s |
| remark/rehype (unified 11) | 6.5 MB | 84 | 566 ms | 0.65 s |
| **satteri 0.9.5** | 3.0 MB | 7 + native binary | **13 ms** | **0.06 s** |
| **`markdown()` as shipped** | | | **21 ms** | **0.08 s** |

The last row is the preset in this package: Sätteri plus the two guard plugins, which walk the HTML AST from JavaScript
and cost roughly 8 ms per 1 000 pages. Even with them it stays twice as fast as bare marked and 27× faster than
remark/rehype.

The feature spike (GFM + heading anchors + Shiki + sanitization) landed all three engines at 1.1–1.4 s per 1 000 pages —
highlighting and sanitizing dominate, the parser does not. What separated them was everything else:

* **marked** is one 480 kB dependency, but its extensibility ceiling is real: anchors and Shiki both meant replacing
  whole renderer methods, and it passes raw HTML and `javascript:` URLs straight through.
* **remark/rehype** has the ecosystem (`rehype-slug`, `rehype-sanitize` at 296 kB, `@shikijs/rehype`) and drops raw HTML
  by default, but 84 packages and 566 ms for plain GFM is a lot to ask of every Sphido site.
* **Sätteri** parses in Rust and exposes the same mdast/hast shapes the unified ecosystem uses, so a plugin is a plain
  object with visitors — the two guards in this package are 20 lines together. The trade-offs are its age (0.9.x, MIT,
  first released March 2026, actively developed) and prebuilt native binaries: `x64`/`arm64` for Linux (gnu and musl),
  macOS and Windows, plus a `wasm32-wasi` fallback.

Sanitization is the one place the engines differ by an order of magnitude in weight: `rehype-sanitize` is 296 kB, while
a DOM-based `DOMPurify` pass drags in jsdom at 28 MB. That is why the default here is escaping rather than a bundled
sanitizer — no dependency, and the escape hatch is one option away.

If the trade-off doesn't suit your project, `render` makes the engine a one-line decision.

## TypeScript

The extender adds no new fields to a page — it rewrites `page.content` — so there is no `With*` type to compose. The
option types are exported:

```typescript
import { getPages, type Page } from '@sphido/core';
import { markdown, type MarkdownOptions, type MarkdownRender } from '@sphido/markdown';

const render: MarkdownRender = (md, page) => `<article data-name="${page.name}">${md}</article>`;
const options: MarkdownOptions = {render};

const pages = await getPages<Page>({path: 'content'}, markdown(options));
```

Also exported for reuse: `isMarkdown` (the default file filter), `isSafeUrl`, `defaultProtocols`, `escapeRawHtml`,
`safeUrls()`, `compileOptions()` and `createRenderer()`.

## Source code

[@sphido/markdown](https://github.com/sphido/sphido/tree/main/packages/sphido-markdown)
