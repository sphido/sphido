# @sphido/frontmatter

[![npm version](https://badge.fury.io/js/%40sphido%2Ffrontmatter.svg)](https://badge.fury.io/js/%40sphido%2Ffrontmatter)

[Front matter](https://jekyllrb.com/docs/front-matter/) is an optional section of valid
YAML that is placed at the top of a page and is used for maintaining metadata for the
page and its contents. `@sphido/frontmatter` is `page` extender that process this
blocks inside `page.content`. Using fastest Node.js YAML Parser [js-yaml](https://github.com/nodeca/js-yaml). 

## Install

```bash
yarn add @sphido/frontmatter
```

## Example

```javascript
const globby = require('globby');
const Sphido = require('@sphido/core');
const frontmatter = require('@sphido/frontmatter');

(async () => {

  const pages = await Sphido.getPages(
    await globby('content/**/*.{md,html}'),
    frontmatter
  );

})();
```

## How to add front matter block

* Must be first thing in the file
* Must be valid YAML
* Can be closed between triple-dashed lines `---` or  HTML comments `<!-- -->`

```markdown
---
title: Some page title
tags: [one, two, other]
---

# Content

Lorem ipusm...
```

or 

```markdown
<!--
title: Some page title
tags: [one, two, other]
-->

# Content

Lorem ipusm...
``` 

## Source codes

https://github.com/sphido/sphido/tree/master/packages/sphido-frontmatter