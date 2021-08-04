import test from 'ava';
import {meta} from '../lib/meta.js';

test('title detection', t => {
	const page = {content: '<h1>This will be title</h1>'};
	meta(page);
	t.is(page.title, 'This will be title');
});

test('force title', t => {
	const page = {content: '<h1>This will be title</h1>', title: 'forced title'};
	meta(page);
	t.is(page.title, 'forced title');
});

test('slug', t => {
	const page = {title: '   Thiš Iš Titlě'};
	meta(page);
	t.is(page.slug, 'this-is-title');
});

test('duplicite tags', t => {
	const page = {tags: ['a', 'a', 'a']};
	meta(page);
	t.is(page.tags instanceof Set, true);
	t.is(page.tags.has('a'), true);
	t.is(page.tags.size, 1);
});

test('default', t => {
	const page = {};
	meta(page);

	t.is(page.content, '');
	t.is(page.title, '');
	t.is(page.slug, '');
	t.is(page.date instanceof Date, true);
	t.is(page.tags instanceof Set, true);
	t.deepEqual(page.tags, new Set([]));
});
