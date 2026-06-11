import { allPages, type ExtenderCallback, getPages, type Page } from "@sphido/core";
import { frontmatter, type WithFrontmatter } from "@sphido/frontmatter";
import { describe, expectTypeOf, test } from "vitest";
import { hashtags, type WithHashtags } from "./hashtags.js";

describe("WithHashtags types", () => {
	test("declares the tags field", () => {
		expectTypeOf<WithHashtags>().toEqualTypeOf<{ tags?: Set<string> }>();
	});

	test("hashtags is compatible with ExtenderCallback for any T", () => {
		expectTypeOf(hashtags).toExtend<ExtenderCallback>();
		expectTypeOf(hashtags).toExtend<ExtenderCallback<Page & WithHashtags>>();
	});

	test("issue #45 example compiles", async () => {
		type BlogPage = Page & WithFrontmatter & WithHashtags & { slug: string };

		const pages = await getPages<BlogPage>({ path: "content" }, frontmatter, hashtags, (page) => {
			page.slug = `${page.name}.html`;
			expectTypeOf(page).toEqualTypeOf<BlogPage>();
		});

		for (const page of allPages<BlogPage>(pages)) {
			expectTypeOf(page.title).toEqualTypeOf<string | undefined>();
			expectTypeOf(page.tags).toExtend<Set<string> | undefined>();
			expectTypeOf(page.slug).toEqualTypeOf<string>();
		}
	});
});
