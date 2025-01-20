import { describe, expect, it } from "vitest";
import { hashtags } from "../lib/hashtags.ts";

describe("hashtags", () => {
	it("single tag has been detected", () => {
		const page = { content: "only #one hashtag" };
		hashtags(page, { isFile: () => true });
		expect(page.tags.has("one")).toBe(true);
		expect(page.content).toBe("only [#one](/tag/one) hashtag");
	});

	it("multiple tags have been detected", () => {
		const page = { content: "#one #two #three" };
		hashtags(page, { isFile: () => true });
		expect(page.tags.has("one")).toBe(true);
		expect(page.tags.has("two")).toBe(true);
		expect(page.tags.has("three")).toBe(true);
		expect(page.content).toBe("[#one](/tag/one) [#two](/tag/two) [#three](/tag/three)");
	});

	it("special cases that should be skipped", () => {
		const page = { content: "inside `#code` or ` #code ` with something $#35;" };
		hashtags(page, { isFile: () => true });
		expect(page.tags.has("code")).toBe(false);
		expect(page.tags.has("35")).toBe(false);
	});

	it("preformatted code should be ignored", () => {
		const page = {
			content: "CSS code\n\n```css\n * { color: #fefefe; }\n```\n\n and contains one #hashtag at the end\n",
		};
		hashtags(page, { isFile: () => true });
		expect(page.tags.has("hashtag")).toBe(true);
		expect(page.tags.has("fefefe")).toBe(false);
	});

	it("markdown hash links should be ignored", () => {
		const page = { content: "[link to index](#index)" };
		hashtags(page, { isFile: () => true });
		expect(page.tags.has("index")).toBe(false);
	});

	it("special characters (only _ and - are allowed)", () => {
		const page = { content: " #example_one #example-two #some~special" };
		hashtags(page, { isFile: () => true });
		expect(page.tags.has("example_one")).toBe(true);
		expect(page.tags.has("example-two")).toBe(true);
		expect(page.tags.has("some")).toBe(true);
	});

	it("connected tags should be ignored", () => {
		const page = { content: " #code#not#something" };
		hashtags(page, { isFile: () => true });
		expect(page.tags.has("code")).toBe(true);
		expect(page.tags.has("not")).toBe(false);
		expect(page.tags.has("something")).toBe(false);
	});
});
