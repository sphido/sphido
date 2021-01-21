import test from 'ava';
import emoji from '../lib/emoji.js';

test('emoji test', t => {
	const post = {content: '❤️'};
	emoji(post);
	t.is(post.content.includes('<img'), true);
	t.is(post.content.includes('twemoji.maxcdn.com'), true);
	t.is(post.content.includes('class="emoji"'), true);
});
