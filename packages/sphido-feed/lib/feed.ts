import { writeFile } from "@sphido/core";

const ESC: Record<string, string> = {
	"&": "&amp;",
	"<": "&lt;",
	">": "&gt;",
	'"': "&quot;",
	"'": "&apos;",
};

/** Escape text for XML element content in a single pass */
function escapeXml(text: string): string {
	return text.replace(/[&<>"']/g, (c) => ESC[c]);
}

function href(url: string | URL): string {
	return url instanceof URL ? url.href : String(url);
}

export interface FeedChannel {
	title: string;
	link: string | URL;
	description: string;
	language?: string;
	/** When provided, an `<atom:link rel="self">` element is emitted (feed validators flag its absence) */
	feedUrl?: string | URL;
}

export interface FeedItem {
	title: string;
	url: string | URL;
	date: Date;
	description?: string;
	author?: string;
}

/**
 * Render an RSS 2.0 feed from a channel and an iterable of items.
 *
 * The channel requires title, link and description — a TypeError is thrown
 * when any of them is missing. Every item requires a Date — items without one
 * are not skipped, a TypeError is thrown (a feed with undated items is broken
 * for every reader). Dates are formatted as RFC 822 via Date#toUTCString and
 * lastBuildDate is derived from the newest item.
 *
 * @see https://www.rssboard.org/rss-specification
 */
export function renderFeed(channel: FeedChannel, items: Iterable<FeedItem>): string {
	const { title, link, description, language, feedUrl } = channel;

	if (!title || !link || !description) {
		throw new TypeError("Feed channel requires title, link and description");
	}

	const itemParts: string[] = [];
	let newest: Date | undefined;

	for (const item of items) {
		if (!(item.date instanceof Date) || Number.isNaN(item.date.getTime())) {
			throw new TypeError(`Feed item "${item.title}" requires a valid date`);
		}
		if (newest === undefined || item.date > newest) {
			newest = item.date;
		}

		const url = escapeXml(href(item.url));
		itemParts.push(
			"\t\t<item>\n",
			`\t\t\t<title>${escapeXml(item.title)}</title>\n`,
			`\t\t\t<link>${url}</link>\n`,
			`\t\t\t<guid isPermaLink="true">${url}</guid>\n`,
			`\t\t\t<pubDate>${item.date.toUTCString()}</pubDate>\n`,
		);

		if (item.description !== undefined) {
			itemParts.push(`\t\t\t<description>${escapeXml(item.description)}</description>\n`);
		}

		if (item.author !== undefined) {
			itemParts.push(`\t\t\t<author>${escapeXml(item.author)}</author>\n`);
		}

		itemParts.push("\t\t</item>\n");
	}

	const parts: string[] = [
		'<?xml version="1.0" encoding="UTF-8"?>\n',
		feedUrl !== undefined ? '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">\n' : '<rss version="2.0">\n',
		"\t<channel>\n",
		`\t\t<title>${escapeXml(title)}</title>\n`,
		`\t\t<link>${escapeXml(href(link))}</link>\n`,
		`\t\t<description>${escapeXml(description)}</description>\n`,
	];

	if (language !== undefined) {
		parts.push(`\t\t<language>${escapeXml(language)}</language>\n`);
	}

	if (feedUrl !== undefined) {
		parts.push(`\t\t<atom:link href="${escapeXml(href(feedUrl))}" rel="self" type="application/rss+xml"/>\n`);
	}

	if (newest !== undefined) {
		parts.push(`\t\t<lastBuildDate>${newest.toUTCString()}</lastBuildDate>\n`);
	}

	parts.push(...itemParts, "\t</channel>\n", "</rss>\n");
	return parts.join("");
}

/** Write feed XML to a file, creating the directory when needed */
export async function writeFeed(file: string, xml: string): Promise<void> {
	return writeFile(file, xml);
}
