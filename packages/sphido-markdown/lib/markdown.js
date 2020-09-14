'use strict';

const marked = require('marked');

const markdown = page => {
	page.content = page.ext === '.html' ? page.content : marked(page.content);
};

module.exports = {
	marked,
	options: (options) => {
		marked.use({options});
	},
	renderer: (renderer) => {
		marked.use({renderer});
	},
	tokenizer: (tokenizer) => {
		marked.use({tokenizer});
	},
	markdown
}