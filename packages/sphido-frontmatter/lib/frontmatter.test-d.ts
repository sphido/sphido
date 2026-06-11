import { type ExtenderCallback, getPages, type Page } from "@sphido/core";
import { describe, expectTypeOf, test } from "vitest";
import { frontmatter, type WithFrontmatter } from "./frontmatter.js";

type FmPage = Page & WithFrontmatter;

describe("WithFrontmatter types", () => {
	test("declares the fields the extender adds", () => {
		expectTypeOf<WithFrontmatter>().toEqualTypeOf<{
			title?: string;
			description?: string;
			date?: string | Date;
			tags?: string[];
			slug?: string;
			fmParseError?: string;
		}>();
	});

	test("frontmatter is compatible with ExtenderCallback for any T", () => {
		expectTypeOf(frontmatter).toExtend<ExtenderCallback>();
		expectTypeOf(frontmatter).toExtend<ExtenderCallback<FmPage>>();
	});

	test("getPages<FmPage> accepts frontmatter and types its fields", () => {
		const pages = getPages<FmPage>({ path: "content" }, frontmatter);
		expectTypeOf(pages).toEqualTypeOf<Promise<FmPage[]>>();

		void pages.then(([page]) => {
			expectTypeOf(page.title).toEqualTypeOf<string | undefined>();
			expectTypeOf(page.date).toEqualTypeOf<string | Date | undefined>();
			expectTypeOf(page.tags).toEqualTypeOf<string[] | undefined>();
			expectTypeOf(page.fmParseError).toEqualTypeOf<string | undefined>();
		});
	});
});
