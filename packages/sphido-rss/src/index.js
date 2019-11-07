const defaultOptions = {
	title: 'Untitled RSS',
	link: '',
	description: '',
	lastBuildDate: new Date().toUTCString(),
	generator: 'Sphido CMS',
};

const toXML = (object) => Object.entries(object).map(([tag, value]) => {
	value = value && typeof value === 'object' ? toXML(value) : value;
	return typeof value !== "undefined" ? isNaN(+tag) ? `<${tag}>${value}</${tag}>` : value : '';
}).join('');

const CDATA = (value) => `<![CDATA[${value}]]>`;

const toAtomItem = function (post) {
	return {
		item: {
			guid: post.link ? post.link : undefined,
			title: post.title ? post.title : undefined,
			link: post.link ? post.link : undefined,
			pubDate: post.date instanceof Date ? post.date.toUTCString() : undefined,
			description: post.description ? CDATA(post.description) : undefined,
			'content:encoded': post.content ? CDATA(post.content.replace(/<h1.*>.*?<\/h1>/g, '')) : undefined
		}
	}
};

/**
 * Generate ATOM feeed from posts
 * @param posts
 * @param options
 * @returns {string}
 */
module.exports = function (posts, options, atomLink) {
	return `<?xml version="1.0" encoding="UTF-8"?>` +
		`<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/"><channel>` +
		(atomLink ? `<atom:link href="${atomLink}" rel="self" type="application/rss+xml" />` : '') +
		toXML(Object.assign({}, defaultOptions, options)) +
		toXML(posts.map(toAtomItem)) +
		`</channel></rss>`;
};