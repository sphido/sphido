import path from 'path';
import {fileURLToPath} from 'url';
import test from 'ava';
import {getPage} from '../lib/get-page.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

test('RSS basics', async t => {
	const page = await getPage(path.join(__dirname, '/page.html'));

	t.is(page.base, 'page');
	t.is(page.dir.includes('test'), true);
	t.is(page.ext, '.html');
});
