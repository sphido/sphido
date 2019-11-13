'use strict';

import test from 'ava';
import frontmatter from '../src/index';


import SphidoPagination from "../../sphido-pagination/src";

const posts = [
	{title: 'first'},
	{title: 'second'},
	{title: 'another one'},
	{title: 'another one'},
	{title: 'another one'},
	{title: 'another one'},
	{title: 'another one'},
	{title: 'another one', content: 'content'}
];

const markdown = {
	content: `---\ntitle: example title\n slug: homepage\ntags:[a, b, c]\n---\n\n content content content\n\n`
};


test('frontmatter markdown basics', t => {
	let page = frontmatter(markdown);

	t.is(page.title, 'example title');
	t.is(page.slug, 'homepage');
});
