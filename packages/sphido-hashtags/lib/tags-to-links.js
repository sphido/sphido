import slugify from '@sindresorhus/slugify';

/**
 * Transform hashtags to makdown links
 * @param {string} content
 * @param {array} tags
 * @param {string} prefix
 * @returns {string}
 */
export function tagsToLinks(content, tags = [], prefix = '/tag/') {
	if (tags) {
		const anchor = new RegExp('(' + tags.join('|') + ')', 'gmi');
		return content.replace(anchor, (match, capture) => `[${match}](${prefix}${slugify(capture)})`);
	}

	return content;
}
