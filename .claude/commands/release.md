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
- Packages: @sphido/core, @sphido/frontmatter, @sphido/hashtags, @sphido/sitemap.
- Each package has `publishConfig.access: "public"`. Trusted Publisher on npmjs.com points to workflow `publish.yaml`.
- Do NOT run `pnpm publish` locally — publishing only happens in CI from a tag.
- Always confirm with the user before pushing the tag.
