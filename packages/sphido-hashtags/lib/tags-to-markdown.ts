import slugify from "@sindresorhus/slugify";

function escapeRegExp(text: string): string {
	return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** * Convert #hashtags to Markdown links (leaves code blocks and inline code untouched) */
export function tagsToMarkdown(
	content: string,
	tags: readonly string[] | null = [],
	{ urlBase = "/tag/", tagToUrl = slugify }: { urlBase?: string; tagToUrl?: (s: string) => string } = {},
): string {
	if (!tags || tags.length === 0) {
		return content;
	}

	// Longest tags first so #ab is not partially matched by #a; the trailing
	// (?![\w-]) prevents a tag from matching as a prefix of a longer one.
	// Code spans/blocks are matched first and kept as-is.
	const sorted = [...tags].sort((a, b) => b.length - a.length).map(escapeRegExp);
	const anchor = new RegExp(`\`{3}[\\s\\S]*?\`{3}|\`[^\`]*\`|(?<=^|\\s)(${sorted.join("|")})(?![\\w-])`, "gim");

	return content.replace(anchor, (match: string, tag: string | undefined): string =>
		tag ? `[${match}](${urlBase}${tagToUrl(tag)})` : match,
	);
}
