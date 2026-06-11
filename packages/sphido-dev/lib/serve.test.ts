import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { type ServeHandle, serve } from "./serve.js";

interface Site {
	dir: string;
	content: string;
	output: string;
}

const sites: Site[] = [];
const handles: ServeHandle[] = [];

async function createSite(): Promise<Site> {
	const dir = await mkdtemp(join(tmpdir(), "sphido-dev-"));
	const content = join(dir, "content");
	const output = join(dir, "public");
	await mkdir(content, { recursive: true });
	await mkdir(join(output, "blog"), { recursive: true });
	await writeFile(join(output, "index.html"), "<html><body><h1>Home</h1></body></html>");
	await writeFile(join(output, "about.html"), "<html><body>About</body></html>");
	await writeFile(join(output, "bare.html"), "<h1>No body tag</h1>");
	await writeFile(join(output, "blog", "index.html"), "<html><body>Blog</body></html>");
	await writeFile(join(output, "style.css"), "body { color: red; }");
	await writeFile(join(output, "data.json"), '{"ok":true}');
	await writeFile(join(dir, "secret.txt"), "top secret"); // outside of output on purpose
	const site = { dir, content, output };
	sites.push(site);
	return site;
}

async function start(site: Site, build: () => void | Promise<void> = () => {}): Promise<ServeHandle> {
	const handle = await serve({ watch: [site.content], output: site.output, build, port: 0 });
	handles.push(handle);
	return handle;
}

/** Poll `probe` until it returns a value other than `undefined` or the deadline passes */
async function waitFor<T>(probe: () => Promise<T | undefined>, timeout = 8000, interval = 100): Promise<T> {
	const deadline = Date.now() + timeout;
	for (;;) {
		const result = await probe();
		if (result !== undefined) {
			return result;
		}
		if (Date.now() > deadline) {
			throw new Error("waitFor: timed out");
		}
		await new Promise((resolve) => setTimeout(resolve, interval));
	}
}

/** Open the live-reload SSE endpoint and collect everything it sends */
async function openSse(url: string) {
	const controller = new AbortController();
	const response = await fetch(`${url}__sphido_reload`, { signal: controller.signal });
	expect(response.headers.get("content-type")).toBe("text/event-stream");
	if (!response.body) {
		throw new Error("SSE response has no body");
	}
	const reader = response.body.getReader();
	const decoder = new TextDecoder();
	let text = "";
	void (async () => {
		try {
			for (;;) {
				const { done, value } = await reader.read();
				if (done) {
					break;
				}
				text += decoder.decode(value, { stream: true });
			}
		} catch {
			// connection aborted or closed
		}
	})();
	return { received: () => text, abort: () => controller.abort() };
}

beforeEach(() => {
	vi.spyOn(console, "log").mockImplementation(() => {});
});

afterEach(async () => {
	vi.restoreAllMocks();
	await Promise.all(handles.splice(0).map((handle) => handle.close()));
	await Promise.all(sites.splice(0).map((site) => rm(site.dir, { recursive: true, force: true })));
});

describe("static server", () => {
	it("serves files with correct content types", async () => {
		const { url } = await start(await createSite());

		const html = await fetch(`${url}index.html`);
		expect(html.status).toBe(200);
		expect(html.headers.get("content-type")).toBe("text/html; charset=utf-8");
		expect(await html.text()).toContain("<h1>Home</h1>");

		const css = await fetch(`${url}style.css`);
		expect(css.status).toBe(200);
		expect(css.headers.get("content-type")).toBe("text/css; charset=utf-8");

		const json = await fetch(`${url}data.json`);
		expect(json.status).toBe(200);
		expect(json.headers.get("content-type")).toBe("application/json");
	});

	it("serves index.html for directories", async () => {
		const { url } = await start(await createSite());

		expect(await (await fetch(url)).text()).toContain("Home");
		expect(await (await fetch(`${url}blog/`)).text()).toContain("Blog");
		expect(await (await fetch(`${url}blog`)).text()).toContain("Blog");
	});

	it("falls back to <path>.html for extensionless URLs", async () => {
		const { url } = await start(await createSite());

		const response = await fetch(`${url}about`);
		expect(response.status).toBe(200);
		expect(response.headers.get("content-type")).toBe("text/html; charset=utf-8");
		expect(await response.text()).toContain("About");
	});

	it("returns 404 for missing files", async () => {
		const { url } = await start(await createSite());

		expect((await fetch(`${url}missing.html`)).status).toBe(404);
		expect((await fetch(`${url}missing/`)).status).toBe(404);
	});

	it("injects the reload script into HTML responses only", async () => {
		const { url } = await start(await createSite());

		const html = await (await fetch(url)).text();
		expect(html).toContain('new EventSource("/__sphido_reload")');
		expect(html).toMatch(/<script>.*<\/script><\/body>/);

		const bare = await (await fetch(`${url}bare.html`)).text();
		expect(bare).toContain("__sphido_reload"); // appended even without </body>

		const css = await (await fetch(`${url}style.css`)).text();
		expect(css).not.toContain("EventSource");
	});

	it("returns 404 for path traversal attempts", async () => {
		const { url } = await start(await createSite());

		for (const attempt of [
			"../secret.txt",
			"%2e%2e/secret.txt",
			"%2e%2e%2fsecret.txt",
			"..%2fsecret.txt",
			"blog/%2e%2e/%2e%2e/secret.txt",
		]) {
			const response = await fetch(`${url}${attempt}`);
			expect(response.status, `GET /${attempt}`).toBe(404);
			expect(await response.text()).not.toContain("top secret");
		}
	});
});

describe("serve", () => {
	it("runs the initial build once before serving", async () => {
		const site = await createSite();
		await rm(join(site.output, "index.html"));
		let builds = 0;
		const handle = await start(site, async () => {
			builds++;
			await writeFile(join(site.output, "index.html"), "<html><body>Built</body></html>");
		});

		expect(builds).toBe(1);
		expect(handle.url).toMatch(/^http:\/\/localhost:\d+\/$/);
		expect(await (await fetch(handle.url)).text()).toContain("Built");
	});

	it("rebuilds and broadcasts a reload event when a watched file changes", async () => {
		const site = await createSite();
		let builds = 0;
		const handle = await start(site, () => {
			builds++;
		});
		const sse = await openSse(handle.url);

		// keep touching the watched file until the reload event arrives (fs.watch
		// delivery may lag right after the watcher is set up, especially on CI)
		await waitFor(async () => {
			await writeFile(join(site.content, "post.md"), `# hello ${Date.now()}`);
			return sse.received().includes("data: reload") ? true : undefined;
		});

		expect(builds).toBeGreaterThanOrEqual(2); // initial build + at least one rebuild
		sse.abort();
	});

	it("keeps the server alive when the user build throws", async () => {
		const errors = vi.spyOn(console, "error").mockImplementation(() => {});
		const site = await createSite();
		let builds = 0;
		const handle = await start(site, () => {
			builds++;
			throw new Error("boom");
		});

		expect(errors).toHaveBeenCalled();
		expect((await fetch(handle.url)).status).toBe(200);

		// a failing rebuild must not kill the server either
		await waitFor(async () => {
			await writeFile(join(site.content, "post.md"), `# boom ${Date.now()}`);
			return builds >= 2 ? true : undefined;
		});
		expect((await fetch(handle.url)).status).toBe(200);
	});

	it("close() shuts the server down", async () => {
		const handle = await start(await createSite());
		expect((await fetch(handle.url)).status).toBe(200);

		await handle.close();
		await expect(fetch(handle.url)).rejects.toThrow();
	});
});
