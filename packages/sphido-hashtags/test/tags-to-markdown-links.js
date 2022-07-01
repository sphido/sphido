import test from 'ava';
import {tagsToMarkdownLinks} from '../lib/hashtags.js';

test('empty tag array shouldn\'t convert anything', t => {
	t.is(
		'some #content',
		tagsToMarkdownLinks('some #content', []),
	);
});

test('single tag should be converted', t => {
	t.is(
		'some [#content](/tag/content) content',
		tagsToMarkdownLinks('some #content content', ['#content']),
	);
});

test('multiple tags should ve converted', t => {
	t.is(
		'some [#a](/tag/a) [#a](/tag/a) [#b](/tag/b)',
		tagsToMarkdownLinks('some #a #a #b', ['#a', '#b']),
	);
});

test('change tag urlBase', t => {
	t.is(
		'[#a](/new-base/a)',
		tagsToMarkdownLinks('#a', ['#a'], {urlBase: '/new-base/'}),
	);
});

test('change tagToUrl function', t => {
	t.is(
		'[#a](/tag/#a)',
		tagsToMarkdownLinks('#a', ['#a'], {tagToUrl: (tag) => tag}),
	);
});