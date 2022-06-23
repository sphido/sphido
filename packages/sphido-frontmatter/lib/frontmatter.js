import yaml from 'js-yaml';
import {readFile} from '@sphido/core';

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
 * @param {Object} page
 * @param {Dirent} dirent
 */
export async function frontmatter(page, dirent) {
	if (dirent.isFile()) {
		if (!page?.content && page?.path) {
			page.content = await readFile(page.path);
		}

		// Process frontmatter
		if (page?.content.startsWith('---') || page?.content.startsWith('<!--')) {
			let meta = {};
			page.content.replace(/^<!--([\s\S]+?)-->|^---([\s\S]+?)---/, (frontMatter, html, md) => {
				meta = yaml.load((html || md).trim());
				page = Object.assign(page, meta);
				page.content = page.content.slice(frontMatter.length).trim();
			});
		}
	}
}
