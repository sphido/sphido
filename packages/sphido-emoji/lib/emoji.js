import twemoji from 'twemoji';

/**
 * Process page content and replace with emoji
 * @param {Object} page
 */
export default function emoji(page) {
	page.content = twemoji.parse(page.content); // Emoji
}
