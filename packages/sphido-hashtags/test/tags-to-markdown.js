import { tagsToMarkdown } from "@sphido/hashtags";
import test from "ava";

test("empty tag array shouldn't convert anything", (t) => {
	t.is(tagsToMarkdown("some #content", []), "some #content");

	t.is(tagsToMarkdown("some #content", null), "some #content");
});

test("single tag should be converted", (t) => {
	t.is(tagsToMarkdown("some #content content", ["#content"]), "some [#content](/tag/content) content");
});

test("multiple tags should ve converted", (t) => {
	t.is(tagsToMarkdown("some #a #a #b", ["#a", "#b"]), "some [#a](/tag/a) [#a](/tag/a) [#b](/tag/b)");
});

test("change tag urlBase", (t) => {
	t.is(tagsToMarkdown("#a", ["#a"], { urlBase: "/new-base/" }), "[#a](/new-base/a)");
});

test("change tagToUrl function", (t) => {
	t.is(tagsToMarkdown("#a", ["#a"], { tagToUrl: (tag) => tag }), "[#a](/tag/#a)");
});
