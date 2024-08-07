import { hashtags } from "@sphido/hashtags";
import test from "ava";

test("single tag has been detected", (t) => {
	const page = { content: "only #one hashtag" };
	hashtags(page, { isFile: () => true });
	t.true(page.tags.has("one"));
	t.is(page.content, "only [#one](/tag/one) hashtag");
});

test("multiple tags has been detected", (t) => {
	const page = { content: "#one #two #three" };
	hashtags(page, { isFile: () => true });
	t.true(page.tags.has("one"));
	t.true(page.tags.has("two"));
	t.true(page.tags.has("three"));
	t.is(page.content, "[#one](/tag/one) [#two](/tag/two) [#three](/tag/three)");
});

test("special cases that should be skipped", (t) => {
	const page = { content: "inside `#code` or ` #code ` with something $#35;" };
	hashtags(page, { isFile: () => true });
	t.false(page.tags.has("code"));
	t.false(page.tags.has("35"));
});

test("preformated code should be ignored", (t) => {
	const page = {
		content: "CSS code\n\n```css\n * { color: #fefefe; }\n```\n\n and contains one #hashtag at the end\n",
	};
	hashtags(page, { isFile: () => true });
	t.true(page.tags.has("hashtag"));
	t.false(page.tags.has("fefefe"));
});

test("markdown hash links should be ignored", (t) => {
	const page = { content: "[link to index](#index)" };
	hashtags(page, { isFile: () => true });
	t.false(page.tags.has("index"));
});

test("special characters (only _ and - are allowed)", (t) => {
	const page = { content: " #example_one #example-two #some~special" };
	hashtags(page, { isFile: () => true });
	t.true(page.tags.has("example_one"));
	t.true(page.tags.has("example-two"));
	t.true(page.tags.has("some"));
});

test("connected tags should be ignored", (t) => {
	const page = { content: " #code#not#something" };
	hashtags(page, { isFile: () => true });
	t.true(page.tags.has("code"));
	t.false(page.tags.has("not"));
	t.false(page.tags.has("something"));
});
