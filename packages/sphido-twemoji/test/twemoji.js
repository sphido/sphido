import test from 'ava';
import twemoji from '..';

test('twemoji', t => {
	const post = {content: '❤️'};
	twemoji(post);
	t.is(post.content.includes('<img'), true);
	t.is(post.content.includes('twemoji.maxcdn.com'), true);
	t.is(post.content.includes('class="emoji"'), true);
});
