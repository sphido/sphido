'use strict';

const marked = require('marked');

module.exports = page => {
	page.content = page.ext === '.html' ? page.content : marked(page.content);
};