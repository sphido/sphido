import test from 'ava';

const {getPage} = require('..');

test('RSS basics', async t => {
	let page = await getPage(__dirname + '/page.html');

	t.is(page.base, 'page');
	t.is(page.dir, 'test');
	t.is(page.ext, '.html');
});