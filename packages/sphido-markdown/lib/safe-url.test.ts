import { describe, expect, test } from "vitest";
import { defaultProtocols, isSafeUrl } from "./safe-url.js";

describe("isSafeUrl", () => {
	test.each([
		"https://sphido.cz",
		"http://sphido.cz/page.html?a=1#b",
		"mailto:roman@ozana.cz",
		"tel:+420123456789",
		"../other.html",
		"/absolute/path",
		"#fragment",
		"//sphido.cz/protocol-relative",
		"page.md",
		"",
	])("accepts %s", (url) => {
		expect(isSafeUrl(url)).toBe(true);
	});

	test.each([
		"javascript:alert(1)",
		"JavaScript:alert(1)",
		"  javascript:alert(1)",
		"java\tscript:alert(1)",
		"java\nscript:alert(1)",
		"jav\u0000ascript:alert(1)",
		"vbscript:msgbox(1)",
		"data:text/html;base64,PHN2Zy8+",
		"file:///etc/passwd",
	])("rejects %s", (url) => {
		expect(isSafeUrl(url)).toBe(false);
	});

	test.each([
		"javascript&colon;alert(1)",
		"javascript&#58;alert(1)",
		"javascript&#x3a;alert(1)",
		"java&Tab;script:alert(1)",
		"java&#09;script:alert(1)",
		"&#106;avascript:alert(1)",
		"&#x6a;avascript:alert(1)",
	])("rejects the entity-encoded %s", (url) => {
		expect(isSafeUrl(url)).toBe(false);
	});

	test("survives entities that decode to nothing sensible", () => {
		expect(isSafeUrl("https://sphido.cz/?a=1&#999999999999;b=2")).toBe(true);
		expect(isSafeUrl("https://sphido.cz/?a=1&unknown;b=2")).toBe(true);
	});

	test("takes a custom protocol list", () => {
		expect(isSafeUrl("data:image/gif;base64,R0lGOD", ["http", "https", "data"])).toBe(true);
		expect(isSafeUrl("mailto:roman@ozana.cz", ["http", "https"])).toBe(false);
		expect(isSafeUrl("HTTPS://sphido.cz", ["https"])).toBe(true);
	});

	test("defaults to the documented protocols", () => {
		expect(defaultProtocols).toEqual(["http", "https", "mailto", "tel"]);
	});
});
