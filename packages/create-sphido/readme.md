# create-sphido

Scaffold a new [Sphido](https://sphido.cz) site with a single command:

```shell
npm create sphido my-blog
```

or with pnpm:

```shell
pnpm create sphido my-blog
```

When no directory is given, the project is created in `my-site`. The target
directory must be empty (or not exist yet).

## What you get

A minimal, working blog that builds on the first run:

```
my-blog/
├── package.json        # type: module, deps, "build" script
├── index.js            # build script — getPages() + extenders + marked + sitemap
├── layout.js           # single template-literal layout function
├── .gitignore
└── content/
    ├── index.md        # front matter + sample text
    ├── about.md
    └── blog/
        └── hello-world.md   # uses #hashtags to demonstrate the extender
```

The generated `index.js` demonstrates the Sphido extender model:
[`@sphido/frontmatter`](https://www.npmjs.com/package/@sphido/frontmatter) reads
YAML front matter, [`@sphido/hashtags`](https://www.npmjs.com/package/@sphido/hashtags)
turns `#hashtags` into links, a small callback computes `page.slug` and `page.url`,
[marked](https://www.npmjs.com/package/marked) renders Markdown to HTML, and
[`@sphido/sitemap`](https://www.npmjs.com/package/@sphido/sitemap) writes
`public/sitemap.xml` at the end.

## Next steps

```shell
cd my-blog
npm install
node index.js     # build the site into public/
npm run dev       # dev server with live reload on http://localhost:4000
```

The site is generated into `public/`. The `dev` script uses
[`@sphido/dev`](https://www.npmjs.com/package/@sphido/dev) to rebuild on every
change in `content/` and reload the browser automatically.

## License

[MIT](./LICENSE)
