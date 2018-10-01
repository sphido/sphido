'use strict';

module.exports = {

	extenders: [
		// page filters
		require('./lib/filters/frontmatter'),
		require('./lib/filters/htmlize'),
		require('./lib/filters/meta'),

		// page functions
		Object.assign({},
				require('./lib/functions/save'),
				require('./lib/functions/excerpt'),
				require('./lib/functions/url')
		)
	],

	template: require('./lib/template'),
	pagination: require('./lib/pagination'),
	getPages: require('./lib/getPages'),
	getPage: require('./lib/getPage'),
};

