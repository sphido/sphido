import test from 'ava';
import meta from '..';

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
	const page = {title: '$€  Thiš Iš Titlě  €$'};
	meta(page);
	t.is(page.slug, 'this-is-title');
});

test('default', t => {
	const page = {};
	meta(page);

	t.is(page.content, '');
	t.is(page.title, '');
	t.is(page.slug, '');
	t.is(page.date instanceof Date, true);
	t.deepEqual(page.tags, []);
});
