'use strict';
/*
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


	pagination: re
	template: require('./packages/sphido-nunjucks/src/template'),
	SphidoPagination: require('./packages/sphido-SphidoPagination/src/SphidoPagination'),
	getPages: require('./packages/sphido-core/src/get-pages'),
	getPage: require('./packages/sphido-core/src/get-page')
};

*/

module.exports = {
	pagination: require('./packages/sphido-pagination')
};