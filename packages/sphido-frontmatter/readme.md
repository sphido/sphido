# @sphido/frontmatter

[Front matter](https://jekyllrb.com/docs/front-matter/) is an optional section of valid YAML that is placed at the top
of a page and is used for maintaining metadata for the page and its contents. `@sphido/frontmatter` is `page` extender
that process this blocks inside `page.content`. Using the fastest Node.js YAML
Parser [js-yaml](https://github.com/nodeca/js-yaml).

## Install

```bash
yarn add @sphido/frontmatter
```

## Example

```javascript
#!/usr/bin/env node

import { getPages, allPages } from '@sphido/core';
import { dirname, relative } from 'node:path';
import { frontmatter } from '@sphido/frontmatter';

const pages = await getPages({path: 'content'}, frontmatter);

for (const page of allPages(pages)) {
	console.log(page)
}
```

## How to add front matter block

* Must be first in the file
* Must be valid YAML
* Can be closed between triple-dashed lines `---` and `---` or HTML comments `<!-- -->`

```markdown
---
title: Page title
tags: [one, two, other]
---

# Content

Lorem ipusm...
```

or

```markdown
<!--
title: Page title
tags: [one, two, other]
-->

# Content

Lorem ipusm...
```

## Source codes

[@sphido/frontmatter](https://github.com/sphido/sphido/tree/main/packages/sphido-frontmatter)