import { type ExtenderCallback, getPages, type Page } from "@sphido/core";
import type { Features, HastPluginInput, MdastPluginInput } from "satteri";
import { describe, expectTypeOf, test } from "vitest";
import { type MarkdownOptions, type MarkdownRender, markdown } from "./markdown.js";

type BlogPage = Page & { title?: string; slug: string };

describe("markdown types", () => {
	test("markdown() returns an ExtenderCallback usable for any T", () => {
		expectTypeOf(markdown()).toExtend<ExtenderCallback>();
		expectTypeOf(markdown()).toExtend<ExtenderCallback<BlogPage>>();
	});

	test("getPages<BlogPage> accepts markdown()", () => {
		const pages = getPages<BlogPage>({ path: "content" }, markdown());
		expectTypeOf(pages).toEqualTypeOf<Promise<BlogPage[]>>();
	});

	test("render may be sync or async and receives the page", () => {
		expectTypeOf<MarkdownRender>().parameter(0).toEqualTypeOf<string>();
		expectTypeOf<MarkdownRender>().parameter(1).toEqualTypeOf<Page>();
		expectTypeOf<MarkdownRender>().returns.toEqualTypeOf<string | Promise<string>>();

		expectTypeOf<(markdown: string) => string>().toExtend<MarkdownRender>();
		expectTypeOf<(markdown: string) => Promise<string>>().toExtend<MarkdownRender>();
	});

	test("options are all optional", () => {
		expectTypeOf<Record<string, never>>().toExtend<MarkdownOptions>();
		expectTypeOf<MarkdownOptions["allowHtml"]>().toEqualTypeOf<boolean | undefined>();
		expectTypeOf<MarkdownOptions["allowedProtocols"]>().toEqualTypeOf<string[] | false | undefined>();
	});

	test("features and plugins keep the Sätteri types", () => {
		expectTypeOf<MarkdownOptions["features"]>().toExtend<Features | undefined>();
		expectTypeOf<{ gfm: false }>().toExtend<NonNullable<MarkdownOptions["features"]>>();
		expectTypeOf<MarkdownOptions["mdastPlugins"]>().toEqualTypeOf<MdastPluginInput[] | undefined>();
		expectTypeOf<MarkdownOptions["hastPlugins"]>().toEqualTypeOf<HastPluginInput[] | undefined>();
	});
});
