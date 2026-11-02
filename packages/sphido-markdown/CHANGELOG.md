# @sphido/markdown

## 2.1.0

### Minor Changes

- Sätteri 0.9 → 0.11. Default rendering only picks up upstream fixes (footnotes, list numbering, definition lists, raw HTML inside SVG and MathML) and gets faster; the new `attributes` feature (`{.class #id}` on code blocks, headings, inline elements and blocks) is available through `features`
- custom `mdastPlugins` / `hastPlugins` run on Sätteri's updated plugin API: a node handed back to the tree is now a live reference instead of a snapshot, inserting a node inside itself or swapping siblings with a pair of inserts reports an error, and a plugin must declare at least one visitor or hook — see the [Sätteri changelog](https://github.com/bruits/satteri/blob/main/packages/satteri/CHANGELOG.md)

### Patch Changes

- `isSafeUrl` reads the URL scheme through an optional chain; behavior unchanged

## 2.0.0

First release of the rewritten package. The version starts at 2.0.0 because npm permanently blocks every version
number that was unpublished from this name in May 2024 — that covers 0.0.1 through 1.1.0 of the old, unrelated
`@sphido/markdown`, and publishing any of them fails with `409 Conflict`.

### Major Changes

- `markdown()` extender rendering `page.content` from markdown to HTML on [Sätteri](https://satteri.bruits.org/) — GFM, raw HTML escaped, links limited to `http`/`https`/`mailto`/`tel`, code blocks left as `<pre><code class="language-*">` for a highlighter
- pluggable by design: `render` swaps the engine, `sanitize` post-processes the HTML, `features`, `mdastPlugins` and `hastPlugins` reach Sätteri, `include` picks the files
