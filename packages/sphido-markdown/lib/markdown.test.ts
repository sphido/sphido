import type { Dirent } from "node:fs";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { getPages, type Page } from "@sphido/core";
import { frontmatter } from "@sphido/frontmatter";
import { afterEach, beforeEach, describe, expect, test } from "vitest";
import { isMarkdown, markdown } from "./markdown.js";

function fileDirent(name = "page.md"): Dirent {
	return { name, isFile: () => true, isDirectory: () => false } as Dirent;
}

function dirDirent(name = "sub"): Dirent {
	return { name, isFile: () => false, isDirectory: () => true } as Dirent;
}

function page(content?: string, path = "content/page.md"): Page {
	return { name: "page", path, content } as Page;
}

describe("markdown", () => {
	test("renders a GFM table", async () => {
		const p = page("| a | b |\n|---|---|\n| 1 | 2 |\n");
		await markdown()(p, fileDirent());
		expect(p.content).toContain("<table>");
		expect(p.content).toContain("<th>a</th>");
		expect(p.content).toContain("<td>2</td>");
	});

	test("renders the rest of GFM — strikethrough, task lists, autolinks", async () => {
		const p = page("~~gone~~\n\n- [x] done\n- [ ] todo\n\nhttps://sphido.cz\n");
		await markdown()(p, fileDirent());
		expect(p.content).toContain("<del>gone</del>");
		expect(p.content).toContain('<input type="checkbox" checked disabled>');
		expect(p.content).toContain('<a href="https://sphido.cz">');
	});

	test("strips a front matter block it was handed", async () => {
		const p = page("---\ntitle: Post\n---\n\n# Post\n");
		await markdown()(p, fileDirent());
		expect(p.content).toContain("<h1>Post</h1>");
		expect(p.content).not.toContain("title: Post");
	});

	test("keeps code blocks ready for a highlighter", async () => {
		const p = page("```javascript\nconst x = 1;\n```\n");
		await markdown()(p, fileDirent());
		expect(p.content).toContain('<pre><code class="language-javascript">');
		expect(p.content).toContain("const x = 1;");
	});

	test("escapes raw HTML by default", async () => {
		const p = page('<script>alert(1)</script>\n\ntext with <img src=x onerror="alert(2)"> inline\n');
		await markdown()(p, fileDirent());
		expect(p.content).not.toContain("<script>");
		expect(p.content).not.toContain("<img");
		expect(p.content).toContain("&lt;script&gt;");
		expect(p.content).toContain('&lt;img src=x onerror="alert(2)"&gt; inline');
	});

	test("allowHtml keeps raw HTML in place", async () => {
		const p = page('<div class="raw">block</div>\n\ntext <b>bold</b>\n');
		await markdown({ allowHtml: true })(p, fileDirent());
		expect(p.content).toContain('<div class="raw">block</div>');
		expect(p.content).toContain("<b>bold</b>");
	});

	test("drops the URL of links and images with an unsafe protocol, keeping their text", async () => {
		const p = page("[click](javascript:alert(1)) and ![shot](data:text/html;base64,PHN2Zz4=)\n");
		await markdown()(p, fileDirent());
		expect(p.content).not.toContain("javascript:");
		expect(p.content).not.toContain("data:text/html");
		expect(p.content).toContain("<a>click</a>");
		expect(p.content).toContain('<img alt="shot">');
	});

	test("keeps links with an allowed protocol, and relative ones", async () => {
		const p = page("[web](https://sphido.cz) [mail](mailto:roman@ozana.cz) [rel](../other.html) [top](#start)\n");
		await markdown()(p, fileDirent());
		expect(p.content).toContain('href="https://sphido.cz"');
		expect(p.content).toContain('href="mailto:roman@ozana.cz"');
		expect(p.content).toContain('href="../other.html"');
		expect(p.content).toContain('href="#start"');
	});

	test("allowedProtocols extends the list", async () => {
		const p = page("![inline](data:image/gif;base64,R0lGOD)\n");
		await markdown({ allowedProtocols: ["http", "https", "data"] })(p, fileDirent());
		expect(p.content).toContain('src="data:image/gif;base64,R0lGOD"');
	});

	test("allowedProtocols false turns the check off", async () => {
		const p = page("[app](custom-scheme:open)\n");
		await markdown({ allowedProtocols: false })(p, fileDirent());
		expect(p.content).toContain('href="custom-scheme:open"');
	});

	test("features are passed to the parser", async () => {
		const gfm = page("| a |\n|---|\n| 1 |\n");
		await markdown({ features: { gfm: false } })(gfm, fileDirent());
		expect(gfm.content).not.toContain("<table>");

		const smart = page('"quoted" -- dashed\n');
		await markdown({ features: { smartPunctuation: true } })(smart, fileDirent());
		expect(smart.content).toContain("“quoted”");
		expect(smart.content).toContain("–");
	});

	test("mdastPlugins can rewrite the markdown AST", async () => {
		const p = page("# Heading\n");
		await markdown({
			mdastPlugins: [
				{
					name: "shout",
					heading(node, ctx) {
						ctx.setProperty(node, "children", [{ type: "text", value: ctx.textContent(node).toUpperCase() }]);
					},
				},
			],
		})(p, fileDirent());
		expect(p.content).toContain("<h1>HEADING</h1>");
	});

	test("hastPlugins run after the safe defaults, so they may emit raw HTML", async () => {
		const p = page("```javascript\nconst x = 1;\n```\n\n<b>author html</b>\n");
		await markdown({
			hastPlugins: [
				{
					name: "fake-highlighter",
					element: {
						filter: ["pre"],
						visit(node, ctx) {
							ctx.replaceNode(node, { type: "raw", value: '<pre class="highlighted">const x = 1;</pre>' });
						},
					},
				},
			],
		})(p, fileDirent());
		expect(p.content).toContain('<pre class="highlighted">const x = 1;</pre>');
		expect(p.content).toContain("&lt;b&gt;author html&lt;/b&gt;");
	});

	test("render replaces the engine, sync or async", async () => {
		const sync = page("# ignored\n");
		await markdown({ render: (md, target) => `<article data-name="${target.name}">${md.trim()}</article>` })(
			sync,
			fileDirent(),
		);
		expect(sync.content).toBe('<article data-name="page"># ignored</article>');

		const async = page("hello\n");
		await markdown({ render: async (md) => `<p>${md.trim().toUpperCase()}</p>` })(async, fileDirent());
		expect(async.content).toBe("<p>HELLO</p>");
	});

	test("sanitize runs on the rendered HTML", async () => {
		const p = page("<b>raw</b> and **strong**\n");
		await markdown({ allowHtml: true, sanitize: (html) => html.replaceAll(/<\/?b>/g, "") })(p, fileDirent());
		expect(p.content).toContain("raw");
		expect(p.content).not.toContain("<b>");
		expect(p.content).toContain("<strong>strong</strong>");
	});

	test("sanitize also sees the output of a custom render", async () => {
		const p = page("x\n");
		await markdown({ render: () => "<p>rendered</p>", sanitize: (html, target) => `${html}<!-- ${target.name} -->` })(
			p,
			fileDirent(),
		);
		expect(p.content).toBe("<p>rendered</p><!-- page -->");
	});

	test("skips directories", async () => {
		const p = page("# not rendered\n", "content/sub");
		await markdown()(p, dirDirent());
		expect(p.content).toBe("# not rendered\n");
	});

	test("skips files that are not markdown", async () => {
		const html = '<!DOCTYPE html><html lang="en"><body>hand written</body></html>';
		const p = page(html, "content/index.html");
		await markdown()(p, fileDirent("index.html"));
		expect(p.content).toBe(html);
	});

	test("include overrides which files are rendered", async () => {
		const p = page("# text\n", "content/page.txt");
		await markdown({ include: (dirent) => dirent.name.endsWith(".txt") })(p, fileDirent("page.txt"));
		expect(p.content).toContain("<h1>text</h1>");
	});

	test("throws when used without calling the factory", () => {
		const extender = markdown as unknown as (page: Page, dirent: Dirent) => void;
		expect(() => extender(page("# x\n"), fileDirent())).toThrow(/factory/);
	});
});

describe("markdown is safe by default", () => {
	async function render(content: string): Promise<string> {
		const p = page(content);
		await markdown()(p, fileDirent());
		return String(p.content);
	}

	test.each([
		"[x](javascript:alert(1))",
		"[x](JaVaScRiPt:alert(1))",
		"[x](  javascript:alert(1))",
		"[x](javascript&#58;alert(1))",
		"[x](&#106;avascript:alert(1))",
		"[x](vbscript:msgbox)",
		"[x](file:///etc/passwd)",
	])("neutralizes %s", async (content) => {
		const html = await render(content);
		expect(html).not.toMatch(/href="[^"]*(?:javascript|vbscript|file):/i);
		expect(html).toContain(">x<");
	});

	test.each([
		'<a href="javascript:alert(1)">raw</a>',
		"<img src=x onerror=alert(1)>",
		"<svg><script>alert(1)</script></svg>",
		"<iframe src=//evil.example></iframe>",
	])("escapes the raw HTML %s", async (content) => {
		const html = await render(content);
		expect(html).not.toMatch(/<(?:a|img|svg|script|iframe)[\s>]/);
		expect(html).toContain("&lt;");
	});

	test("leaves honest links, images and code alone", async () => {
		expect(await render("[i](https://ok.example/path?a=1&b=2)")).toContain(
			'<a href="https://ok.example/path?a=1&amp;b=2">',
		);
		expect(await render("![j](/img/photo.png)")).toContain('<img src="/img/photo.png" alt="j">');
		expect(await render("`<script>alert(1)</script>`")).toContain("<code>&lt;script&gt;alert(1)&lt;/script&gt;</code>");
	});
});

describe("markdown file loading", () => {
	let dir: string;

	beforeEach(async () => {
		dir = await mkdtemp(join(tmpdir(), "sphido-markdown-"));
	});

	afterEach(async () => {
		await rm(dir, { recursive: true, force: true });
	});

	test("loads content from page.path when it is not in memory", async () => {
		const path = join(dir, "page.md");
		await writeFile(path, "# from file\n");

		const p = { name: "page", path } as Page;
		await markdown()(p, fileDirent());
		expect(p.content).toContain("<h1>from file</h1>");
	});

	test("leaves an empty file alone", async () => {
		const path = join(dir, "empty.md");
		await writeFile(path, "");

		const p = { name: "empty", path } as Page;
		await markdown()(p, fileDirent());
		expect(p.content).toBe("");
	});

	test("works as the last extender of getPages()", async () => {
		await writeFile(join(dir, "post.md"), "---\ntitle: Post\n---\n\n# Post\n\nwith **text**\n");
		await writeFile(join(dir, "index.html"), "<p>untouched</p>");

		const pages = await getPages({ path: dir }, frontmatter, markdown());
		const post = pages.find((candidate) => candidate.name === "post") as Page;
		const index = pages.find((candidate) => candidate.name === "index") as Page;

		expect(post.title).toBe("Post");
		expect(post.content).toContain("<h1>Post</h1>");
		expect(post.content).toContain("<strong>text</strong>");
		expect(index.content).toBe("<p>untouched</p>");
	});
});

describe("isMarkdown", () => {
	test.each(["page.md", "page.markdown", "page.mdown", "page.mkd", "PAGE.MD"])("accepts %s", (name) => {
		expect(isMarkdown(fileDirent(name))).toBe(true);
	});

	test.each(["index.html", "page.txt", "readme", "page.md.bak"])("rejects %s", (name) => {
		expect(isMarkdown(fileDirent(name))).toBe(false);
	});
});
