import { type FSWatcher, watch } from "node:fs";

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

	const watchers: FSWatcher[] = dirs.map((dir) => watch(dir, { recursive: true }, trigger));

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
