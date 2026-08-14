import {
	type CompileOptions,
	defineHastPlugin,
	type Features,
	type HastPluginDefinition,
	type HastPluginInput,
	type MarkdownToHtmlResult,
	type MdastPluginInput,
	markdownToHtml,
} from "satteri";
import { defaultProtocols, isSafeUrl } from "./safe-url.js";

export type RenderOptions = {
	/** Keep raw HTML in the markdown instead of escaping it. Default: `false` */
	allowHtml?: boolean;
	/** Protocols allowed in links and images, or `false` to allow all of them. Default: {@link defaultProtocols} */
	allowedProtocols?: string[] | false;
	/** [Sätteri parser features](https://satteri.bruits.org/docs/), e.g. `{smartPunctuation: true}` */
	features?: Features;
	/** Sätteri mdast plugins, applied after the safe defaults */
	mdastPlugins?: MdastPluginInput[];
	/** Sätteri hast plugins, applied after the safe defaults */
	hastPlugins?: HastPluginInput[];
};

/** * Render raw HTML as the text the author typed instead of markup */
export const escapeRawHtml: HastPluginDefinition = defineHastPlugin({
	name: "sphido-escape-raw-html",
	raw(node, ctx) {
		ctx.replaceNode(node, { type: "text", value: node.value });
	},
});

/** * Drop the `href`/`src` of links and images whose protocol is not allowed */
export function safeUrls(protocols: string[] = defaultProtocols): HastPluginDefinition {
	return defineHastPlugin({
		name: "sphido-safe-urls",
		element: {
			filter: ["a", "img"],
			visit(node, ctx) {
				const attribute = node.tagName === "a" ? "href" : "src";
				const url = node.properties?.[attribute];
				if (typeof url === "string" && !isSafeUrl(url, protocols)) {
					ctx.setProperty(node, attribute, undefined);
				}
			},
		},
	});
}

/**
 * Compile options carrying the Sphido preset: raw HTML escaped and links
 * restricted to known protocols. Both guards are ordinary hast plugins placed
 * before the ones passed in, so a plugin of your own can still emit raw HTML.
 */
export function compileOptions(options: RenderOptions = {}): CompileOptions {
	const { allowHtml = false, allowedProtocols = defaultProtocols, features, mdastPlugins = [], hastPlugins } = options;

	return {
		features,
		mdastPlugins,
		hastPlugins: [
			...(allowHtml ? [] : [escapeRawHtml]),
			...(allowedProtocols === false ? [] : [safeUrls(allowedProtocols)]),
			...(hastPlugins ?? []),
		],
	};
}

/**
 * Build the default `markdown()` render function — markdown in, HTML out.
 *
 * Returns a promise only when one of the plugins is async.
 */
export function createRenderer(options: RenderOptions = {}): (markdown: string) => string | Promise<string> {
	const compile = compileOptions(options);

	return (markdown) => {
		// Sätteri compiles synchronously and only awaits when a plugin is async
		const result = markdownToHtml(markdown, compile) as MarkdownToHtmlResult | Promise<MarkdownToHtmlResult>;
		return result instanceof Promise ? result.then(({ html }) => html) : result.html;
	};
}
