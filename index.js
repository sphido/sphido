'use strict';

module.exports = {

	extenders: [
		// Page filters
		require('./lib/filters/frontmatter'),
		require('./lib/filters/htmlize'),
		require('./lib/filters/meta'),

		// Page functions
		Object.assign({},
			require('./lib/functions/save'),
			require('./lib/functions/excerpt'),
			require('./lib/functions/url')
		)
	],

	template: require('./lib/template'),
	pagination: require('./lib/pagination'),
	getPages: require('./lib/get-pages'),
	getPage: require('./lib/get-page')
};

