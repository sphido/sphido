'use strict';

const {twemoji} = require('twemoji');

/**
 * Process page content and replace with emoji
 * @param {Object} page
 */
module.exports = page => {
	page.content = twemoji.parse(page.content); // Emoji
};
