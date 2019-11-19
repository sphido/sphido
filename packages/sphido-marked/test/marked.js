import test from 'ava';
import marked from '..';

test('basics H1 test', t => {
	let page = {content: `# H1`};
	marked(page);

	t.is(page.content, `<h1 id="h1">H1</h1>\n`);
});

test('not transform html sites', t => {
	let page = {content: `not transform <strong>this</strong>...`, ext: '.html'};
	marked(page);
	t.is(page.content, `not transform <strong>this</strong>...`);
});
