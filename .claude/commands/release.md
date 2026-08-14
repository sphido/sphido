Prepare a release for the sphido monorepo. Follow these steps:

1. Run `pnpm build` to verify the build passes.
2. Run `pnpm test` to verify all tests pass.
3. Ask the user which packages changed and what kind of bump (patch/minor/major) is needed.
4. Bump the `version` field in each affected `packages/*/package.json` manually. Only bump packages that actually changed — `pnpm publish -r` skips versions already on npm.
5. Commit the version bumps (e.g. `chore: release v3.1.0`).
6. Create and push a git tag matching the highest released version:
   ```
   git tag v3.1.0
   git push origin main --tags
   ```
7. The `.github/workflows/publish.yaml` workflow runs on the tag push, builds, tests, then publishes via `pnpm -r publish --access public --no-git-checks --provenance`. It also creates a GitHub Release with auto-generated notes.

Important:
- This is a pnpm monorepo using Turborepo. Releases use **npm Trusted Publishers (OIDC)** — no NPM_TOKEN.
- Packages: @sphido/core, @sphido/frontmatter, @sphido/hashtags, @sphido/markdown, @sphido/sitemap, @sphido/feed, @sphido/collections, @sphido/dev, create-sphido.
- Each package has `publishConfig.access: "public"`. Trusted Publisher on npmjs.com points to workflow `publish.yaml`.
- Do NOT run `pnpm publish` locally — publishing only happens in CI from a tag. The one exception is the first release of a brand-new package, see below.
- The `create-sphido` template pins published versions (`"@sphido/markdown": "^1"`), so a change there means bumping create-sphido in the same release.
- Always confirm with the user before pushing the tag.

First release of a new package:

npm cannot configure a Trusted Publisher for a package that does not exist yet, so CI has no way to publish version 1.0.0 of a new package. Publish it by hand once, then hand it over to CI:

1. From `main`, with `pnpm build && pnpm test` green:
   ```
   cd packages/sphido-<name>
   pnpm publish --access public --no-git-checks
   ```
   Use **`pnpm publish`**, never `npm publish` — only pnpm rewrites the `workspace:*` dependency ranges to real versions. Drop `--provenance`: it only works from CI. Add `--otp=<code>` when the account enforces 2FA on publish.
2. Add the Trusted Publisher on `https://www.npmjs.com/package/@sphido/<name>/access` → GitHub Actions, case-sensitive: organization `sphido`, repository `sphido`, workflow filename `publish.yaml`, no environment.
3. Every later version of that package goes through the normal tag-based release above.
