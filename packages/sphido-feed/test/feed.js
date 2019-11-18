import test from 'ava';
import feed from '..';

const posts = [
	{
		title: 'RSS test',
		description: 'aaa',
		content: '<p>This is content <strong>of article</strong></p>',
		link: 'http://www.rss.com/example',
		date: new Date()
	}
];

test('RSS basics', t => {
	const rss = feed([]);
	t.is(rss.includes('<?xml version="1.0" encoding="UTF-8"?>'), true);
	t.is(rss.includes('<title>Untitled RSS</title>'), true);
	t.is(rss.includes('<generator>Sphido CMS</generator>'), true);
});

test('Change options', t => {
	const rss = feed([], {generator: 'omfg', title: 'example title'});
	t.is(rss.includes('<title>example title</title>'), true);
	t.is(rss.includes('<generator>omfg</generator>'), true);
});

test('Example posts', t => {
	const rss = feed(posts, {link: 'https://sphido.org'});
	t.is(rss.includes(`<title>${posts[0].title}</title>`), true);
	t.is(rss.includes(`<link>${posts[0].link}</link>`), true);
	t.is(rss.includes(`<pubDate>${posts[0].date.toUTCString()}</pubDate>`), true);
	t.is(rss.includes(`<description><![CDATA[${posts[0].description}]]></description>`), true);
	t.is(rss.includes(`<content:encoded><![CDATA[${posts[0].content}]]></content:encoded>`), true);
});
