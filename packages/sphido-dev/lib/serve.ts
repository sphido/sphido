import { createStaticServer } from "./server.js";
import { createBuildRunner, createWatcher } from "./watcher.js";

export { RELOAD_PATH } from "./server.js";

export interface ServeOptions {
	/** Directories to watch for changes (default: `["content"]`) */
	watch?: string[];
	/** Directory with the built site to serve (default: `"public"`) */
	output?: string;
	/** User build function, runs once on start and after every change */
	build: () => void | Promise<void>;
	/** Port to listen on (default: 4000); pass `0` for a random free port */
	port?: number;
}

export interface ServeHandle {
	/** Local URL the dev server is listening on */
	url: string;
	/** Stop watching, disconnect live-reload clients and close the server */
	close: () => Promise<void>;
}

/**
 * Start the Sphido dev loop: run `build()`, serve `output` over HTTP,
 * watch the `watch` directories and live-reload the browser after each rebuild.
 */
export async function serve(options: ServeOptions): Promise<ServeHandle> {
	const { watch = ["content"], output = "public", build, port = 4000 } = options;

	const { server, broadcast, close: closeServer } = createStaticServer(output);
	const rebuild = createBuildRunner(build, broadcast);

	// the initial build runs before the server starts listening
	await rebuild();

	await new Promise<void>((resolve, reject) => {
		server.once("error", reject);
		server.listen(port, resolve);
	});

	const address = server.address();
	const url = `http://localhost:${typeof address === "object" && address ? address.port : port}/`;

	const watcher = createWatcher({ dirs: watch, onChange: () => void rebuild() });

	console.log(`[sphido] dev server running at ${url}`);

	return {
		url,
		close: async () => {
			watcher.close();
			await closeServer();
		},
	};
}
