import test from 'ava';
import SphidoSitemap from '../src/index'

const posts = [
	{
		link: 'http://sitemap.com/example',
		date: new Date()
	},

	{
		link: 'https://sitemap.com/example2',
		date: new Date()
	}
];

test('sitemap.xml basics', t => {
	let sitemap = SphidoSitemap(posts, 'https://www.site.com');
	t.is(sitemap.includes('<?xml version="1.0" encoding="UTF-8"?>'), true);
	t.is(sitemap.includes('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'), true);
	t.is(sitemap.includes('<loc>https://www.site.com</loc>'), true);
});
