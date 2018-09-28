'use strict';

const yaml = require('js-yaml');

/**
 * Process front matter data on the beginning of the markdown file
 *
 * ---
 * title: This will be title
 * data: 2018-09-11
 * tags: [a, b, c]
 * ---
 *
 * @see https://jekyllrb.com/docs/front-matter/
 * @param page
 */
module.exports = page => {
	if (page.ext === '.md' && page.content.startsWith('---')) {
		let meta = {};
		page.content.replace(/^---([\s\S]+?)---/, (frontMatter, data) => {
			meta = yaml.safeLoad(data.trim());
			page = Object.assign(page, meta);
			page.content = page.content.substring(frontMatter.length).trim();
		});
	}
};