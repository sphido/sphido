import slugify from '@sindresorhus/slugify';

function defaultTagToUrl(tag) {
	return `${slugify(tag)}.html`;
}

/**
 * Convert #hashtags to Markdown links
 *
 * @param {string} content
 * @param {array} tags
 * @param {string} urlBase
 * @param {Function} tagToUrl
 * @returns {string}
 */
export function tagsToMarkdown(content, tags = [], {urlBase = '/tag/', tagToUrl = defaultTagToUrl} = {}) {
	if (tags && tags.length > 0) {
		const anchor = new RegExp('(' + tags.join('|') + ')', 'gmi');
		return content.replace(anchor, (match, capture) => `[${match}](${urlBase}${tagToUrl(capture)})`);
	}

	return content;
}
