/**
 * Return hashtags array from string
 *
 * @param {string} content
 * @returns {array}
 */
export function getHashtags(content) {
	return content
		.replace(/`{1,3}[^`]*`{1,3}/gim, '') // Skip code
		.match(/(?<=^|\s)#([\w-]{2,})/gim); // Match all tags
}
