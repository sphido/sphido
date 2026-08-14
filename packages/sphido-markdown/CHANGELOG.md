# @sphido/markdown

## 1.0.0

### Major Changes

- initial release: `markdown()` extender rendering `page.content` from markdown to HTML on [Sätteri](https://satteri.bruits.org/) — GFM, raw HTML escaped, links limited to `http`/`https`/`mailto`/`tel`, code blocks left as `<pre><code class="language-*">` for a highlighter
- pluggable by design: `render` swaps the engine, `sanitize` post-processes the HTML, `features`, `mdastPlugins` and `hastPlugins` reach Sätteri, `include` picks the files
