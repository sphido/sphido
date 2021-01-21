import test from 'ava';
import {link} from '../lib/link.js';

test('basics', t => {
	const page = {
		dir: '/have/nice/dir',
		slug: 'this-is-slug',
		link
	};

	t.is(page.link(), '/have/nice/dir/this-is-slug/');
});
