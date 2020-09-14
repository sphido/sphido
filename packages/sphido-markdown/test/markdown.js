import test from 'ava';
import {parse as markdown, renderer} from '..';

test('basics renderer H1 test', t => {
	const page = {content: '# H1'};

	// @see https://marked.js.org/using_pro#renderer

	renderer({
		heading: (text, level) => {
			return `<h1>XXX - ${text.toLowerCase()} - XXX</h1>`
		}
	});

	markdown(page);

	t.is(page.content, '<h1>XXX - h1 - XXX</h1>');
});

test('basics renderer H1 test', t => {
	const page = {content: '# H1'};

	// @see https://marked.js.org/using_pro#renderer

	renderer({
		heading: (text, level) => {
			return `<h1>XXX - ${text.toLowerCase()} - XXX</h1>`
		}
	});

	markdown(page);

	t.is(page.content, '<h1>XXX - h1 - XXX</h1>');
});