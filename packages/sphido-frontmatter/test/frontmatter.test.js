import { frontmatter } from "@sphido/frontmatter";
import { describe, expect, it } from "vitest";

const page1 = {
	content: "---\ntitle: example title\nslug: homepage\ntags: [a, b, c]\n---\n\ncontent content content",
};

describe("front matter markdown basics", () => {
	it("should parse front matter correctly", () => {
		frontmatter(page1, { isFile: () => true });

		expect(page1.title).toBe("example title");
		expect(page1.slug).toBe("homepage");
		expect(page1.tags).toEqual(["a", "b", "c"]);
	});
});

const page2 = {
	content: "<!--\ntitle: example title\nslug: homepage\ntags: [a, b, c]\n --> \n\ncontent content content",
};

describe("front matter html basics", () => {
	it("should parse front matter correctly", () => {
		frontmatter(page2, { isFile: () => true });

		expect(page2.title).toBe("example title");
		expect(page2.slug).toBe("homepage");
		expect(page2.tags).toEqual(["a", "b", "c"]);
	});
});
