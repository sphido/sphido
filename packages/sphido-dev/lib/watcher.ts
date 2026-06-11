import { type FSWatcher, realpathSync, watch } from "node:fs";

export interface WatcherOptions {
	/** Directories to watch recursively */
	dirs: string[];
	/** Debounce window in milliseconds (default: 50) */
	debounceMs?: number;
	/** Called once per debounced burst of file system events */
	onChange: () => void;
}

export interface Watcher {
	/** Debounced change trigger (also exposed for testing) */
	trigger: () => void;
	/** Stop watching and cancel any pending trigger */
	close: () => void;
}

/**
 * Watch directories recursively and call `onChange` debounced.
 */
export function createWatcher({ dirs, debounceMs = 50, onChange }: WatcherOptions): Watcher {
	let timer: NodeJS.Timeout | undefined;
	let closed = false;

	const trigger = () => {
		if (closed) {
			return;
		}
		clearTimeout(timer);
		timer = setTimeout(onChange, debounceMs);
	};

	const watchers: FSWatcher[] = dirs.map((dir) => {
		// Canonicalize the path (resolves Windows 8.3 short names like RUNNER~1):
		// libuv 1.52.x asserts in fs-event.c when the watched dir prefix does not
		// match the long-form paths reported by ReadDirectoryChangesW.
		const watcher = watch(realpathSync.native(dir), { recursive: true }, trigger);
		// Without a listener an "error" event crashes the whole process —
		// e.g. EPERM on Windows when a watched directory is removed.
		watcher.on("error", (error) => {
			console.error("[sphido] watch error:", error);
			watcher.close();
		});
		return watcher;
	});

	return {
		trigger,
		close: () => {
			closed = true;
			clearTimeout(timer);
			for (const watcher of watchers) {
				watcher.close();
			}
		},
	};
}

/**
 * Wrap the user build function so that runs never overlap: while a build is
 * running at most one follow-up run is queued. Errors are printed and never
 * propagate, so a crashing build keeps the dev server alive.
 */
export function createBuildRunner(build: () => void | Promise<void>, onSuccess: () => void): () => Promise<void> {
	let running = false;
	let queued = false;

	const run = async (): Promise<void> => {
		if (running) {
			queued = true;
			return;
		}
		running = true;
		try {
			await build();
			onSuccess();
		} catch (error) {
			console.error("[sphido] build failed:", error);
		} finally {
			running = false;
			if (queued) {
				queued = false;
				void run();
			}
		}
	};

	return run;
}
