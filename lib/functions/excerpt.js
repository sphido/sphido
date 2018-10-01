'use strict';

let {striptags, truncate} = require('nunjucks/src/filters');

module.exports = {
	excerpt(length) {
		let excerpt = this.content;
		return truncate(striptags(excerpt.replace(/<h1[^>]*?>[\s\S]*?<\/h1>/i, '')), length || 380)
	}
};