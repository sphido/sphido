import test from 'ava';
import nunjucks from '..';

test('example content', async t => {
	const result = await nunjucks.renderString('{{content}}', {content: 'example content'});
	t.is(result, 'example content');
});

test('strip H1', async t => {
	const result = await nunjucks.renderString('{{content|h1strip}}', {content: '<h1>strip h1</h1>'});
	t.is(result, '');
});

test('slugify', async t => {
	const result = await nunjucks.renderString('{{content|h1strip}}', {content: '<h1>strip h1</h1>'});
	t.is(result, '');
});

test('short', async t => {
	const result = await nunjucks.renderString('{{content|short(5)}}', {content: '<p>strip h1</p>'});
	t.is(result, 'strip...');
});
