import {join} from 'path';
import test from 'ava';

const {getPage} = require('..');

test('RSS basics', async t => {
	const page = await getPage(join(__dirname, '/page.html'));

	t.is(page.base, 'page');
	t.is(page.dir.includes('test'), true);
	t.is(page.ext, '.html');
});
