'use strict';

const {statSync} = require('fs');
const {inspect} = require('util');
const slugify = require('@sindresorhus/slugify');

/**
 * Process page metadata like title, author, slug ...
 * @param page
 */
module.exports = page => {
	page.title = page.title || page.content.match(/>(.*?)<\/h/i)[1];
	page.slug = page.slug || slugify(page.title);
	page.date = page.date || new Date(inspect(statSync(page.file).mtime));
	page.tags = [...new Set(page.tags)] || [];
};
