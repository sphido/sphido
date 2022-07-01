import {readFile} from '@sphido/core';
import {getHashtags} from './get-hashtags.js';
import {tagsToMarkdown} from './tags-to-markdown.js';

export {getHashtags} from './get-hashtags.js';
export {tagsToMarkdown} from './tags-to-markdown.js';

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
			page.content = tagsToMarkdown(page.content, tags);
		}
	}
}
