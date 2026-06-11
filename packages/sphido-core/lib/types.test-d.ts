import type { Dirent } from "node:fs";
import { describe, expectTypeOf, test } from "vitest";
import { allPages } from "./all-pages.js";
import { getPages } from "./get-pages.js";
import type { ExtenderCallback, Extenders, Page, Pages } from "./index.js";

type BlogPage = Page & { title?: string; slug?: string };

/**
 * A closed page type without the `Page` index signature —
 * field typos on it are compile errors.
 */
type StrictPage = {
	name: string;
	path: string;
	content?: string;
	children?: Pages<StrictPage>;
	title?: string;
};

describe("getPages types", () => {
	test("defaults to Page so existing call sites compile", () => {
		expectTypeOf(getPages()).toEqualTypeOf<Promise<Page[]>>();
		expectTypeOf(getPages({ path: "content" })).toEqualTypeOf<Promise<Page[]>>();

		// Untyped extenders keep working via the Page index signature
		const pages = getPages({ path: "content" }, (page) => {
			expectTypeOf(page).toEqualTypeOf<Page>();
			page.anything = 1;
		});
		expectTypeOf(pages).toEqualTypeOf<Promise<Page[]>>();
	});

	test("generic inference of getPages<BlogPage>", () => {
		const pages = getPages<BlogPage>({ path: "content" }, (page, dirent, path) => {
			expectTypeOf(page).toEqualTypeOf<BlogPage>();
			expectTypeOf(page.title).toEqualTypeOf<string | undefined>();
			expectTypeOf(dirent).toEqualTypeOf<Dirent>();
			expectTypeOf(path).toEqualTypeOf<string | undefined>();
		});
		expectTypeOf(pages).toEqualTypeOf<Promise<BlogPage[]>>();
	});

	test("field typo on a closed page type is a compile error", () => {
		void getPages<StrictPage>({ path: "content" }, (page) => {
			page.title = "ok";
			// @ts-expect-error - `titel` is a typo, StrictPage has no index signature
			page.titel = "typo";
		});
	});

	test("object extenders are still accepted", () => {
		expectTypeOf(getPages<BlogPage>({}, { author: "Roman" })).toEqualTypeOf<Promise<BlogPage[]>>();
	});
});

describe("allPages types", () => {
	test("preserves T", () => {
		const pages: Pages<BlogPage> = [];
		expectTypeOf(allPages(pages)).toEqualTypeOf<Generator<BlogPage>>();
		expectTypeOf(allPages<BlogPage>(pages)).toEqualTypeOf<Generator<BlogPage>>();

		for (const page of allPages(pages)) {
			expectTypeOf(page).toEqualTypeOf<BlogPage>();
		}
	});

	test("defaults to Page", () => {
		const pages: Pages = [];
		expectTypeOf(allPages(pages)).toEqualTypeOf<Generator<Page>>();
	});
});

describe("helper types", () => {
	test("Pages<T> is Array<T> and defaults to Page", () => {
		expectTypeOf<Pages<BlogPage>>().toEqualTypeOf<BlogPage[]>();
		expectTypeOf<Pages>().toEqualTypeOf<Page[]>();
	});

	test("ExtenderCallback<T> signature", () => {
		expectTypeOf<ExtenderCallback<BlogPage>>().toEqualTypeOf<
			(page: BlogPage, dirent: Dirent, path?: string) => Promise<void> | void
		>();
		expectTypeOf<ExtenderCallback>().toEqualTypeOf<
			(page: Page, dirent: Dirent, path?: string) => Promise<void> | void
		>();
	});

	test("Extenders<T> accepts callbacks and objects", () => {
		const extenders: Extenders<BlogPage> = [
			(page) => {
				page.slug = `${page.name}.html`;
			},
			{ author: "Roman" },
		];
		expectTypeOf(extenders).toEqualTypeOf<Extenders<BlogPage>>();
	});
});
