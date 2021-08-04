import test from 'ava';
import {markdown, renderer} from '../lib/markdown.js';

test('basics renderer H1 test', t => {
	const page = {content: '# H1'};

	// @see https://marked.js.org/using_pro#renderer

	renderer({
		heading: text => `<h1>XXX - ${text.toLowerCase()} - XXX</h1>`,
	});

	markdown(page);

	t.is(page.content, '<h1>XXX - h1 - XXX</h1>');
});
