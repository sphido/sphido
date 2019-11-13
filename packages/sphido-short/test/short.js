import test from 'ava';

const SphidoExcerpt = require('..');

test('excerpt basics', t => {
	let page = {content: '<html><body>content</body></html>'};
	page = Object.assign({}, page, SphidoExcerpt);
	t.is(page.short(), 'content');
	t.is(page.short(1), 'c...');
});