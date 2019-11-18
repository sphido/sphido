import test from 'ava';
import SphidoTwemoji from '..';

const post = {content: '❤️'};

test('Twemoji basic', t => {
	SphidoTwemoji(post);
	t.is(post.content.includes('<img'), true);
	t.is(post.content.includes('twemoji.maxcdn.com'), true);
	t.is(post.content.includes('class="emoji"'), true);
});