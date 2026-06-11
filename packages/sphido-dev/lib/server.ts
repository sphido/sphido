import { readFile, stat } from "node:fs/promises";
import { createServer, type Server, type ServerResponse } from "node:http";
import { extname, join, resolve, sep } from "node:path";

/** Path of the server-sent events endpoint used for live reload */
export const RELOAD_PATH = "/__sphido_reload";

const RELOAD_SCRIPT = `<script>new EventSource("${RELOAD_PATH}").onmessage = () => location.reload();</script>`;

const CONTENT_TYPES: Record<string, string> = {
	".html": "text/html; charset=utf-8",
	".css": "text/css; charset=utf-8",
	".js": "text/javascript; charset=utf-8",
	".mjs": "text/javascript; charset=utf-8",
	".json": "application/json",
	".xml": "application/xml",
	".txt": "text/plain; charset=utf-8",
	".svg": "image/svg+xml",
	".png": "image/png",
	".jpg": "image/jpeg",
	".jpeg": "image/jpeg",
	".gif": "image/gif",
	".webp": "image/webp",
	".avif": "image/avif",
	".ico": "image/x-icon",
	".woff": "font/woff",
	".woff2": "font/woff2",
	".pdf": "application/pdf",
};

export interface StaticServer {
	server: Server;
	/** Send a reload event to all connected live-reload clients */
	broadcast: () => void;
	/** End all live-reload clients and close the server */
	close: () => Promise<void>;
}

/** Inject the live-reload script before `</body>`, or append it when no `</body>` exists */
export function injectReloadScript(html: string): string {
	return html.includes("</body>") ? html.replace("</body>", `${RELOAD_SCRIPT}</body>`) : html + RELOAD_SCRIPT;
}

async function statSafe(path: string) {
	try {
		return await stat(path);
	} catch {
		return undefined;
	}
}

/**
 * Map a URL pathname to a file inside `root`:
 * directory → `index.html`, missing extension → `<path>.html` fallback.
 * Returns `undefined` for traversal attempts and missing files.
 */
async function resolveFile(root: string, pathname: string): Promise<string | undefined> {
	let decoded: string;
	try {
		decoded = decodeURIComponent(pathname);
	} catch {
		return undefined;
	}
	if (decoded.includes("\0")) {
		return undefined;
	}

	const candidate = resolve(join(root, decoded));
	if (candidate !== root && !candidate.startsWith(root + sep)) {
		return undefined; // path traversal attempt
	}

	const candidateStat = await statSafe(candidate);
	if (candidateStat?.isDirectory()) {
		const index = join(candidate, "index.html");
		return (await statSafe(index))?.isFile() ? index : undefined;
	}
	if (candidateStat?.isFile()) {
		return candidate;
	}
	if (extname(candidate) === "") {
		const fallback = `${candidate}.html`;
		if ((await statSafe(fallback))?.isFile()) {
			return fallback;
		}
	}
	return undefined;
}

/**
 * Create a static file server over `output` with a live-reload SSE endpoint.
 */
export function createStaticServer(output: string): StaticServer {
	const root = resolve(output);
	const clients = new Set<ServerResponse>();

	const server = createServer(async (request, response) => {
		const url = new URL(request.url ?? "/", "http://localhost");

		if (url.pathname === RELOAD_PATH) {
			response.writeHead(200, {
				"Content-Type": "text/event-stream",
				"Cache-Control": "no-cache",
				Connection: "keep-alive",
			});
			response.write(": connected\n\n");
			clients.add(response);
			response.once("close", () => clients.delete(response));
			return;
		}

		const file = await resolveFile(root, url.pathname);
		if (!file) {
			response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
			response.end("404 Not Found");
			return;
		}

		try {
			const type = CONTENT_TYPES[extname(file).toLowerCase()] ?? "application/octet-stream";
			if (type.startsWith("text/html")) {
				const html = injectReloadScript(await readFile(file, "utf8"));
				response.writeHead(200, { "Content-Type": type });
				response.end(html);
			} else {
				const content = await readFile(file);
				response.writeHead(200, { "Content-Type": type, "Content-Length": content.byteLength });
				response.end(content);
			}
		} catch {
			response.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
			response.end("500 Internal Server Error");
		}
	});

	const broadcast = () => {
		for (const client of clients) {
			client.write("data: reload\n\n");
		}
	};

	const close = () =>
		new Promise<void>((resolveClose, reject) => {
			for (const client of clients) {
				client.end();
			}
			clients.clear();
			if (!server.listening) {
				resolveClose();
				return;
			}
			server.close((error) => (error ? reject(error) : resolveClose()));
			server.closeAllConnections();
		});

	return { server, broadcast, close };
}
