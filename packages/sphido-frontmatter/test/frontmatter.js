'use strict';

import test from 'ava';
import frontmatter from '..';

let page1 = {
	content: `---\ntitle: example title\nslug: homepage\ntags: [a, b, c]\n---\n\ncontent content content`
};

test('frontmatter markdown basics', t => {

	frontmatter(page1);

	t.is(page1.title, 'example title');
	t.is(page1.slug, 'homepage');
	t.deepEqual(page1.tags, ['a', 'b', 'c']);

});

let page2 = {
	content: `<!--\ntitle: example title\nslug: homepage\ntags: [a, b, c]\n --> \n\ncontent content content`
};

test('frontmatter html basics', t => {

	frontmatter(page2);

	t.is(page2.title, 'example title');
	t.is(page2.slug, 'homepage');
	t.deepEqual(page2.tags, ['a', 'b', 'c']);

});
