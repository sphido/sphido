'use strict';

const {statSync} = require('fs');
const {inspect} = require('util');
const slugify = require('@sindresorhus/slugify');
const headline = /(?<=<h[12][^>]*?>)([^<>]+?)(?=<\/h[12]>)/i;

/**
 * Process page metadata like title, author, slug ...
 * @param page
 */
module.exports = page => {
	page.title = (page.title || (page.content.match(headline) || [page.base]).pop()).trim();
	page.slug = page.slug || slugify(page.title);
	page.date = page.date || new Date(inspect(statSync(page.file).mtime));
	page.tags = [...new Set(page.tags)] || [];
};
