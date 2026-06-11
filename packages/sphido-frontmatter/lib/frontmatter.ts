import type { Dirent } from "node:fs";
import type { Page } from "@sphido/core";
import { readFile } from "@sphido/core";
import yaml from "js-yaml";

/**
 * Process front matter data on the beginning of the markdown file
 *
 * ---
 * title: This will be title
 * data: 2018-09-11
 * tags: [a, b, c]
 * ---
 *
 * or html comments
 *
 * <!--
 * title: This will be title
 * data: 2018-09-11
 * tags: [a, b, c]
 * -->
 *
 * A leading HTML comment is treated as front matter only when it contains
 * a YAML mapping — ordinary comments (e.g. <!-- TODO -->) are left in place.
 *
 * @see https://jekyllrb.com/docs/front-matter/
 */
export async function frontmatter(page: Page, dirent: Dirent): Promise<void> {
	if (!dirent.isFile()) return; // Only process files

	// Load content if not already loaded
	if (!page?.content && page?.path) {
		const content = await readFile(page.path);
		page.content = String(content);
	}

	if (!page?.content) return;

	// Remove BOM if present
	page.content = page.content.replace(/^\uFEFF/, "");

	// Front Matter regex:
	// matches YAML front matter between
	// --- ... --- or <!-- ... -->
	const fmRegex = /^(?:---\r?\n([\s\S]*?)\r?\n---|<!--([\s\S]*?)-->)[\r\n]*/;

	const match = fmRegex.exec(page.content);
	if (!match) return;

	const isHtmlComment = match[1] === undefined;
	const yamlText = (match[1] ?? match[2] ?? "").trim();

	let meta: unknown;
	try {
		meta = yamlText ? yaml.load(yamlText) : undefined;
	} catch (err) {
		// An HTML comment with unparseable YAML is an ordinary comment — leave it in place
		if (isHtmlComment) return;

		// Store front matter parsing error message
		page.fmParseError = err instanceof Error ? err.message : String(err);
		page.content = page.content.slice(match[0].length).trimStart();
		return;
	}

	// Treat an HTML comment as front matter only when it holds a YAML mapping
	if (isHtmlComment && (meta === null || typeof meta !== "object" || Array.isArray(meta))) return;

	if (meta && typeof meta === "object") {
		Object.assign(page, meta);
	}

	// Remove front matter from content
	page.content = page.content.slice(match[0].length).trimStart();
}
