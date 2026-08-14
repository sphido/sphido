# @sphido/markdown

## 2.0.0

First release of the rewritten package. The version starts at 2.0.0 because npm permanently blocks every version
number that was unpublished from this name in May 2024 — that covers 0.0.1 through 1.1.0 of the old, unrelated
`@sphido/markdown`, and publishing any of them fails with `409 Conflict`.

### Major Changes

- `markdown()` extender rendering `page.content` from markdown to HTML on [Sätteri](https://satteri.bruits.org/) — GFM, raw HTML escaped, links limited to `http`/`https`/`mailto`/`tel`, code blocks left as `<pre><code class="language-*">` for a highlighter
- pluggable by design: `render` swaps the engine, `sanitize` post-processes the HTML, `features`, `mdastPlugins` and `hastPlugins` reach Sätteri, `include` picks the files
