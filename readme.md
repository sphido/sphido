
<p align="center">
  <a href="https://sphido.org">
    <img src="https://sphido.org/img/sphido.svg" width=""/>
  </a>
</p>


<p align="center">
  A rocket 🚀 fast, lightweight, static site generator.
</p>

## Installation

```bash
$ npm i @sphido/core @sphido/frontmatter @sphido/markdown @sphido/meta fs-extra globby
```

## Quick Start

```javascript
#!/usr/bin/env node --experimental-modules

import path from "path";
import globby from "globby";
import fs from "fs-extra";
import {getPages} from "@sphido/core";
import {frontmatter} from "@sphido/frontmatter";
import {meta} from "@sphido/meta";
import {markdown} from "@sphido/markdown";

(async () => {

    // 1. get list of pages

    const pages = await getPages(
        await globby('content/**/*.{md,html}'),
        ...[

            frontmatter,
            markdown,
            meta,

            // add custom page extender
            (page) => {
                page.toFile = path.join(
                    page.dir.replace('content', 'public'),
                    page.slug,
                    'index.html'
                );
            },

            // add custom page function
            {
                head: function() {
                  return `<head><meta charset="UTF-8"><title>${this.title}</title></head>`
                },

                getHtml: function () {
                    return `<!DOCTYPE html>` + 
                           `<html lang="en" dir="ltr">` + this.head() + 
                           `<body>${this.content}</body></html>`
                }
            }
        ],
    );

    // 2. save pages

    pages.forEach(page => fs.outputFile(page.toFile, page.getHtml()))

})();
```

## Packages

* [`@sphido/core`](https://github.com/sphido/sphido/tree/main/packages/sphido-core) - basic getPages, getPage functions
* [`@sphido/emoji`](https://github.com/sphido/sphido/tree/main/packages/sphido-emoji) - add twemoji support
* [`@sphido/feed`](https://github.com/sphido/sphido/tree/main/packages/sphido-feed) - generate atom feed from pages
* [`@sphido/frontmatter`](https://github.com/sphido/sphido/tree/main/packages/sphido-frontmatter) - frontmatter for pages
* [`@sphido/link`](https://github.com/sphido/sphido/tree/main/packages/sphido-link) - add link() method to pages
* [`@sphido/markdown`](https://github.com/sphido/sphido/tree/main/packages/sphido-markdown) - markdown page processor 
* [`@sphido/meta`](https://github.com/sphido/sphido/tree/main/packages/sphido-meta) - add common metadata to the pages
* [`@sphido/nunjucks`](https://github.com/sphido/sphido/tree/main/packages/sphido-nunjucks) - add support for nunjucks templates
* [`@sphido/pagination`](https://github.com/sphido/sphido/tree/main/packages/sphido-pagination) - paginate over pages
* [`@sphido/sitemap`](https://github.com/sphido/sphido/tree/main/packages/sphido-sitemap) - generate sitemap.xml

## Examples

* https://github.com/sphido/examples/

## License

MIT