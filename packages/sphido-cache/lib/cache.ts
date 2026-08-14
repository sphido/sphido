import { createHash } from "node:crypto";
import { mkdir, readFile, rename, stat, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import type { Page } from "@sphido/core";

/** How a change is detected: file timestamps or content hashes */
export type CacheStrategy = "mtime" | "hash";

export type CacheOptions = {
	/** Where the state is persisted. Default: `.sphido/cache.json` */
	file?: string;
	/** Default: `"mtime"` — one `stat` per page. `"hash"` reads the file and compares SHA-1 */
	strategy?: CacheStrategy;
	/** Global key: change it — a hash of your layout, say — and every page counts as changed */
	version?: string;
};

type Entry = { mtimeMs: number; size: number } | { hash: string };

type Store = {
	previous: Map<string, Entry>;
	current: Map<string, Entry>;
	loading?: Promise<void>;
};

type CacheFile = {
	version?: string;
	strategy?: CacheStrategy;
	pages?: Record<string, Entry>;
};

const defaults = { file: ".sphido/cache.json", strategy: "mtime" as CacheStrategy };

// One store per cache file, so two caches in a single build never mix
const stores = new Map<string, Store>();

function store(file: string): Store {
	const key = resolve(file);
	const existing = stores.get(key);
	if (existing) return existing;

	const created: Store = { previous: new Map(), current: new Map() };
	stores.set(key, created);
	return created;
}

/**
 * Load the state written by the last build.
 *
 * Anything unusable — a missing file, unparseable JSON, a different `version`
 * or a different `strategy` — leaves the previous state empty, so every page
 * counts as changed. That is the safe direction: a rebuild too many, never a
 * page too few.
 */
async function load(file: string, strategy: CacheStrategy, version?: string): Promise<Store> {
	const state = store(file);
	if (state.loading) {
		await state.loading;
		return state;
	}

	state.loading = (async () => {
		let parsed: CacheFile;
		try {
			parsed = JSON.parse(await readFile(file, "utf8"));
		} catch {
			return;
		}

		if (parsed?.strategy !== strategy || parsed?.version !== version || typeof parsed?.pages !== "object") return;

		for (const [path, entry] of Object.entries(parsed.pages ?? {})) {
			state.previous.set(path, entry);
		}
	})();

	await state.loading;
	return state;
}

async function entryFor(path: string, strategy: CacheStrategy): Promise<Entry> {
	if (strategy === "hash") {
		return {
			hash: createHash("sha1")
				.update(await readFile(path))
				.digest("hex"),
		};
	}

	const { mtimeMs, size } = await stat(path);
	return { mtimeMs, size };
}

function same(a: Entry, b: Entry): boolean {
	if ("hash" in a || "hash" in b) return "hash" in a && "hash" in b && a.hash === b.hash;
	return a.mtimeMs === b.mtimeMs && a.size === b.size;
}

async function missing(path: string): Promise<boolean> {
	try {
		await stat(path);
		return false;
	} catch {
		return true;
	}
}

/**
 * Has the page changed since the last build?
 *
 * ```javascript
 * for (const page of allPages(pages)) {
 * 	if (!(await changed(page))) continue; // output is up to date
 * 	await writeFile(page.output, layout(page));
 * }
 *
 * await writeCache();
 * ```
 *
 * The page's state is recorded in memory as a side effect, so {@link writeCache}
 * persists exactly the pages this build looked at. Unknown pages, unreadable
 * sources and — when `page.output` is already set — a missing output file all
 * count as changed.
 */
export async function changed(page: Page, options: CacheOptions = {}): Promise<boolean> {
	const { file = defaults.file, strategy = defaults.strategy, version } = options;
	const state = await load(file, strategy, version);

	if (typeof page?.path !== "string") return true;

	let entry: Entry;
	try {
		entry = await entryFor(page.path, strategy);
	} catch {
		return true; // source gone or unreadable — let the build deal with it
	}

	state.current.set(page.path, entry);

	const previous = state.previous.get(page.path);
	if (!previous || !same(previous, entry)) return true;

	// The state can be right about the source and still be stale: `rm -rf public`
	return typeof page.output === "string" && (await missing(page.output));
}

/**
 * Paths recorded by the previous build that this build never saw — their
 * sources are gone, their outputs are not. Call it before {@link writeCache},
 * which forgets the previous state.
 */
export function removed(options: CacheOptions = {}): string[] {
	const state = store(options.file ?? defaults.file);
	return [...state.previous.keys()].filter((path) => !state.current.has(path));
}

/**
 * Persist what {@link changed} collected. Write it only after a successful
 * build — a half-written site with a fully-written cache skips the rest
 * forever.
 *
 * The file is written next to its target and renamed into place, so an
 * interrupted build cannot leave a truncated cache behind.
 */
export async function writeCache(options: CacheOptions = {}): Promise<void> {
	const { file = defaults.file, strategy = defaults.strategy, version } = options;
	const state = store(file);

	const data: CacheFile = { version, strategy, pages: Object.fromEntries(state.current) };

	await mkdir(dirname(resolve(file)), { recursive: true });
	const temporary = `${file}.${process.pid}.tmp`;
	await writeFile(temporary, `${JSON.stringify(data)}\n`);
	await rename(temporary, file);

	// The state just written is what the next rebuild in this process compares
	// against — the dev server would otherwise keep rebuilding the same page
	state.previous = new Map(state.current);
	state.current = new Map();
}

/** Forget the in-memory state for a cache file, so the next {@link changed} reads it from disk again */
export function resetCache(options: CacheOptions = {}): void {
	stores.delete(resolve(options.file ?? defaults.file));
}
