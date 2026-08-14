import type { Dirent } from "node:fs";
import { type ExtenderCallback, type Page, readFile } from "@sphido/core";
import { createRenderer, type RenderOptions } from "./render.js";

export { compileOptions, createRenderer, escapeRawHtml, type RenderOptions, safeUrls } from "./render.js";
export { defaultProtocols, isSafeUrl } from "./safe-url.js";

/** Turns markdown into HTML. Return a promise for async engines. */
export type MarkdownRender = (markdown: string, page: Page) => string | Promise<string>;

/** Post-processes the rendered HTML, e.g. through a full sanitizer */
export type MarkdownSanitize = (html: string, page: Page) => string | Promise<string>;

export type MarkdownOptions = RenderOptions & {
	/** Render with another engine instead of the built-in Sätteri preset */
	render?: MarkdownRender;
	/** Run the rendered HTML through a sanitizer such as `rehype-sanitize` or DOMPurify */
	sanitize?: MarkdownSanitize;
	/** Which files to render. Default: {@link isMarkdown} */
	include?: (dirent: Dirent) => boolean;
};

/** * Accept markdown files only — an `*.html` page has to stay untouched */
export function isMarkdown(dirent: Dirent): boolean {
	return /\.(?:md|markdown|mdown|mkd)$/i.test(dirent.name);
}

/**
 * Render `page.content` from markdown to HTML.
 *
 * ```javascript
 * const pages = await getPages({path: 'content'}, frontmatter, hashtags, markdown());
 * ```
 *
 * Content is loaded from `page.path` when it isn't in memory yet, the same way
 * the frontmatter and hashtags extenders do it. Put `markdown()` last — every
 * extender that works with markdown has to run before the HTML exists.
 *
 * Out of the box: GFM, raw HTML escaped, links limited to
 * {@link defaultProtocols} and code blocks kept as `<pre><code
 * class="language-*">` for a highlighter. Escape hatches: `allowHtml`,
 * `allowedProtocols`, `features`, `mdastPlugins`, `hastPlugins`, `sanitize`
 * and `render`.
 */
export function markdown(options: MarkdownOptions = {}): ExtenderCallback {
	if (typeof (options as Page).path === "string" && typeof (options as Page).name === "string") {
		throw new TypeError("markdown is a factory — pass markdown() to getPages(), not markdown");
	}

	const { render = createRenderer(options), sanitize, include = isMarkdown } = options;

	return async (page: Page, dirent: Dirent): Promise<void> => {
		if (!dirent.isFile() || !include(dirent)) return;

		if (!page?.content && page?.path) {
			page.content = await readFile(page.path);
		}

		if (!page?.content) return;

		const html = await render(page.content, page);
		page.content = sanitize ? await sanitize(html, page) : html;
	};
}
