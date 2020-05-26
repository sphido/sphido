/**
 * Generate ATOM feed from posts
 * @param {array} posts
 * @param {Object} options
 * @param {string} feed
 * @returns {string}
 */
module.exports = function (posts, options, feed = undefined) {
	const defaultOptions = {
		title: 'Untitled RSS',
		link: '',
		description: '',
		lastBuildDate: new Date().toUTCString(),
		generator: 'Sphido CMS'
	};

	const toXML = object => Object.entries(object).map(([tag, value]) => {
		value = value && typeof value === 'object' ? toXML(value) : value;

		if (typeof value === 'undefined') {
			return '';
		}

		return Number.isNaN(Number(tag)) ? `<${tag}>${value}</${tag}>` : value;
	}).join('');

	return '<?xml version="1.0" encoding="UTF-8"?>' +
		'<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/"><channel>' +
		(feed ? `<atom:link href="${feed}" rel="self" type="application/rss+xml" />` : '') +
		toXML(Object.assign({}, defaultOptions, options)) +
		toXML(posts.map(post => {
			return {
				item: {
					guid: typeof post.link === 'function' ? post.link() : post.link,
					title: post.title ? post.title : undefined,
					link: typeof post.link === 'function' ? post.link() : post.link,
					pubDate: post.date instanceof Date ? post.date.toUTCString() : undefined,
					description: post.description ? `<![CDATA[${post.description}]]>` : undefined,
					'content:encoded': post.content ? `<![CDATA[${post.content.replace(/<h1.*>.*?<\/h1>/g, '')}]]>` : undefined
				}
			};
		})) +
		'</channel></rss>';
};
