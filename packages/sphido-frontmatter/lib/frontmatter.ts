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

	const yamlText = (match[1] ?? match[2] ?? "").trim();

	try {
		if (yamlText) {
			const meta = yaml.load(yamlText) as Record<string, unknown> | undefined;
			if (meta && typeof meta === "object") {
				Object.assign(page, meta);
			}
		}
	} catch (err) {
		// Store front matter parsing error message
		(page as Page).fmParseError = err instanceof Error ? err.message : String(err);
	} finally {
		// Remove front matter from content
		page.content = page.content.slice(match[0].length).trimStart();
	}
}
