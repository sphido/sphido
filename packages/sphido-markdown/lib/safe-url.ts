/** Protocols allowed in links and images unless configured otherwise */
export const defaultProtocols = ["http", "https", "mailto", "tel"];

// Entities that can hide a protocol from a naive check, e.g. `java&Tab;script&colon;alert(1)`
const namedEntities: Record<string, string> = { tab: "\t", newline: "\n", colon: ":" };

const maxCodePoint = 0x10ffff;

// Space, C0/C1 controls and the exotic blanks browsers ignore inside a URL
const blankCodePoints = new Set([0x7f, 0xa0, 0x1680, 0x2028, 0x2029, 0x202f, 0x205f, 0x3000, 0xfeff]);

function decodeEntities(url: string): string {
	return url.replace(/&(?:#(\d+)|#[xX]([\da-fA-F]+)|([a-zA-Z]+));?/g, (entity, decimal, hex, name) => {
		const code = decimal ? Number.parseInt(decimal, 10) : hex ? Number.parseInt(hex, 16) : Number.NaN;
		if (Number.isNaN(code)) return namedEntities[String(name).toLowerCase()] ?? entity;
		return code <= maxCodePoint ? String.fromCodePoint(code) : entity;
	});
}

function stripBlanks(url: string): string {
	let stripped = "";
	for (const char of url) {
		const code = char.codePointAt(0) ?? 0;
		if (code > 0x20 && !blankCodePoints.has(code)) stripped += char;
	}
	return stripped;
}

/**
 * Is the URL safe to put into an `href` or `src` attribute?
 *
 * Relative URLs, fragments and protocol-relative URLs pass; an absolute URL
 * passes only when its protocol is on the list. Entities and blanks are
 * decoded and stripped first, so `java&#09;script:alert(1)` is rejected the
 * same way `javascript:alert(1)` is.
 */
export function isSafeUrl(url: string, protocols: string[] = defaultProtocols): boolean {
	const protocol = /^([a-z][a-z\d+.-]*):/i.exec(stripBlanks(decodeEntities(url)));
	if (!protocol) return true;
	return protocols.some((allowed) => allowed.toLowerCase() === protocol[1].toLowerCase());
}
