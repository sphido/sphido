import test from 'ava';
import SphidoNunjucks from '..';

test('example content', async t => {
	let result = await SphidoNunjucks.renderString('{{content}}', {content: 'example content'});
	t.is(result, 'example content');
});

test('strip H1', async t => {
	let result = await SphidoNunjucks.renderString('{{content|h1strip}}', {content: '<h1>strip h1</h1>'});
	t.is(result, '');
});

test('slugify', async t => {
	let result = await SphidoNunjucks.renderString('{{content|h1strip}}', {content: '<h1>strip h1</h1>'});
	t.is(result, '');
});