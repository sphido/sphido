import {readFile} from '@sphido/core';
import {getHashtags} from './get-hashtags.js';
import {tagsToMarkdownLinks} from './tags-to-markdown-links.js';

export {getHashtags} from './get-hashtags.js';
export {tagsToMarkdownLinks} from './tags-to-markdown-links.js';

/**
 * Replace hashtags in markdown with links
 * @param {Object} page
 * @param {Dirent} dirent
 */
export async function hashtags(page, dirent) {
	if (dirent.isFile()) {
		if (!page?.content && page?.path) {
			page.content = await readFile(page.path);
		}

		if (page?.content) {
			const tags = getHashtags(page.content);
			page.tags = new Set(tags?.map(tag => tag.slice(1))); // Create unique tags list
			page.content = tagsToMarkdownLinks(page.content, tags);
		}
	}
}
