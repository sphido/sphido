import { frontmatter } from "@sphido/frontmatter";
import test from "ava";

const page1 = {
	content: "---\ntitle: example title\nslug: homepage\ntags: [a, b, c]\n---\n\ncontent content content",
};

test("front matter markdown basics", (t) => {
	frontmatter(page1, { isFile: () => true });

	t.is(page1.title, "example title");
	t.is(page1.slug, "homepage");
	t.deepEqual(page1.tags, ["a", "b", "c"]);
});

const page2 = {
	content: "<!--\ntitle: example title\nslug: homepage\ntags: [a, b, c]\n --> \n\ncontent content content",
};

test("front matter html basics", (t) => {
	frontmatter(page2, { isFile: () => true });

	t.is(page2.title, "example title");
	t.is(page2.slug, "homepage");
	t.deepEqual(page2.tags, ["a", "b", "c"]);
});
