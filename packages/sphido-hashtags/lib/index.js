import {tagsToLinks} from './tags-to-links.js';
import {getHashtags} from './get-hashtags.js';

export {getHashtags} from './get-hashtags.js';
export {tagsToLinks} from './tags-to-links.js';

/**
 * Replace hashtags in markdown with links
 * @param {Object} page
 */
export function hashtags(page) {
	const tags = getHashtags(page?.content);
	page.tags = new Set(tags?.map(tag => tag.slice(1))); // Create unique tags list
	page.content = tagsToLinks(page?.content, tags);
}
