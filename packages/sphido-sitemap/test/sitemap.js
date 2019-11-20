import test from 'ava';
import sitemap from '..';

const posts = [
	{
		link: 'http://sitemap.com/example',
		date: new Date()
	},

	{
		link: 'https://sitemap.com/example2',
		date: new Date()
	},

	{
		link: () => 'generated with link function',
		date: new Date()
	}
];

test('sitemap.xml basics', t => {
	const s = sitemap(posts, 'https://www.site.com');
	t.is(s.includes('<?xml version="1.0" encoding="UTF-8"?>'), true);
	t.is(s.includes('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'), true);
	t.is(s.includes('<loc>https://www.site.com</loc>'), true);
	t.is(s.includes('<loc>generated with link function</loc>'), true);
});
