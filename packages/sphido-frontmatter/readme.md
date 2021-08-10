# @sphido/frontmatter

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
import globby from 'globby';
import {getPages} from '@sphido/core';
import {frontmatter} from '@sphido/frontmatter';

(async () => {

  const pages = await getPages(
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

https://github.com/sphido/sphido/tree/main/packages/sphido-frontmatter