import slugify from '@sindresorhus/slugify';

/**
 * Transform hashtags to Markdown links
 *
 * @param {string} content
 * @param {array} tags
 * @param {string} urlBase
 * @param {Function} tagToUrl
 * @returns {string}
 */
export function tagsToMarkdownLinks(content, tags = [], {urlBase = '/tag/', tagToUrl = slugify} = {}) {
	if (tags.length) {
		const anchor = new RegExp('(' + tags.join('|') + ')', 'gmi');
		return content.replace(anchor, (match, capture) => `[${match}](${urlBase}${tagToUrl(capture)})`);
	}

	return content;
}
