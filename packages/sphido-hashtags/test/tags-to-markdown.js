import test from 'ava';
import {tagsToMarkdown} from '../lib/hashtags.js';

test('empty tag array shouldn\'t convert anything', t => {
	t.is(
		'some #content',
		tagsToMarkdown('some #content', []),
	);

	t.is(
		'some #content',
		tagsToMarkdown('some #content', null),
	);
});

test('single tag should be converted', t => {
	t.is(
		'some [#content](/tag/content) content',
		tagsToMarkdown('some #content content', ['#content']),
	);
});

test('multiple tags should ve converted', t => {
	t.is(
		'some [#a](/tag/a) [#a](/tag/a) [#b](/tag/b)',
		tagsToMarkdown('some #a #a #b', ['#a', '#b']),
	);
});

test('change tag urlBase', t => {
	t.is(
		'[#a](/new-base/a)',
		tagsToMarkdown('#a', ['#a'], {urlBase: '/new-base/'}),
	);
});

test('change tagToUrl function', t => {
	t.is(
		'[#a](/tag/#a)',
		tagsToMarkdown('#a', ['#a'], {tagToUrl: (tag) => tag}),
	);
});