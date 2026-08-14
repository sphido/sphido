# create-sphido

## 1.2.0

### Minor Changes

- the template renders markdown through [`@sphido/markdown`](https://www.npmjs.com/package/@sphido/markdown) instead of calling marked in the build loop — `markdown()` runs as the last extender and `page.content` arrives as HTML

## 1.1.0

### Minor Changes

- the template now includes a development workflow: the build logic moved into `build.js`, a new `dev.js` runs it through `@sphido/dev` (`npm run dev` — watch mode + live reload), and `@sphido/dev` ships as a devDependency of the scaffolded project

## 1.0.0

### Major Changes

- initial release: scaffold a minimal working Sphido blog via `npm create sphido <dir>` — copies a bundled template (index.js with frontmatter + hashtags extenders, layout.js, sample content), rewrites the generated `package.json` name, restores `.gitignore`, and refuses non-empty target directories
