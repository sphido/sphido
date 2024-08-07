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
	if (dirent.isFile()) {
		if (!page?.content && page?.path) {
			page.content = await readFile(page.path);
		}

		// Process Front Matter
		if (page?.content.startsWith("---") || page?.content.startsWith("<!--")) {
			let meta = {};
			page.content.replace(
				/^<!--([\s\S]+?)-->|^---([\s\S]+?)---/,
				(frontMatter: string, html: string, md: string): string => {
					meta = yaml.load((html || md).trim());
					// biome-ignore lint/style/noParameterAssign: We have to :)
					page = Object.assign(page, meta) satisfies Page;
					return page.content.slice(frontMatter.length).trim();
				},
			);
		}
	}
}
