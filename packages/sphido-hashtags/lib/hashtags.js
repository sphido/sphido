import slugify from '@sindresorhus/slugify';

/**
 * Replace hashtags in markdown with links
 * @param {Object} page
 */
export function hashtags(page) {
	const tags = page.content
		.replace(/`{1,3}[^`]*`{1,3}/gim, '') // Skip code
		.match(/(?<=^|\s)#([\w-]{2,})/gim); // Match all tags

	page.tags = new Set(tags?.map(tag => tag.slice(1))); // Create unique tags list

	if (tags) {
		const anchor = new RegExp('(' + tags.join('|') + ')', 'gmi');
		page.content = page.content.replace(anchor, (match, capture) => `[${match}](/tag/${slugify(capture)})`);
	}
}
