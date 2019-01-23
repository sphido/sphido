'use strict';

const {striptags, truncate} = require('nunjucks/src/filters');

module.exports = {
	excerpt(length) {
		const excerpt = this.content;
		return truncate(striptags(excerpt.replace(/<h1[^>]*?>[\s\S]*?<\/h1>/i, '')), length || 380);
	}
};
