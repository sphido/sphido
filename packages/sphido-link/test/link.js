import test from 'ava';
import {link} from '..';

test('basics', t => {
	let page = {
		dir: '/have/nice/dir',
		slug: 'this-is-slug',
		link: link
	};

	t.is(page.link(), '/have/nice/dir/this-is-slug/');
});