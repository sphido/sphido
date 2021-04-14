
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
$ npm i @sphido/core @sphido/nunjucks @sphido/frontmatter @sphido/markdown @sphido/meta
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

```bash
npm i @sphido/core           # basic getPages, getPage functions
npm i @sphido/emoji          # add twemoji support
npm i @sphido/feed           # generate atom feed from pages
npm i @sphido/frontmatter    # frontmatter for pages
npm i @sphido/link           # add link() method to pages
npm i @sphido/markdown       # markdown page processor 
npm i @sphido/meta           # add common metadata to the pages
npm i @sphido/nunjucks       # nunjucks templates
npm i @sphido/pagination     # paginate over pages
npm i @sphido/sitemap        # generate sitemap.xml
```

## Examples

* https://github.com/sphido/examples/

## License

MIT