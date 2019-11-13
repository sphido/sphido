'use strict';

const {striptags, truncate} = require('nunjucks/src/filters');

module.exports = {
	short(length) {
		const short = this.content;
		return truncate(striptags(short.replace(/<h1[^>]*?>[\s\S]*?<\/h1>/i, '')), length || 380);
	}
};
