import test from 'ava';
import {renderString, env} from '..';

test('example content', async t => {
	const result = await renderString('{{content}}', {content: 'example content'});
	t.is(result, 'example content');
});

test('custom filter', async t => {
	env.addFilter('xxx', str => 'working well');
	const result = await renderString('{{content|xxx}}', {content: '<p>strip h1</p>'});
	t.is(result, 'working well');
});
