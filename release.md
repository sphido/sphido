# Release

## 1. Create a changeset

```bash
pnpm changeset
```

Interactively select the changed packages and the bump type (patch/minor/major).

## 2. Commit and push

```bash
git add .changeset
git commit -m "chore: add changeset"
git push
```

## 3. Merge the "Version Packages" PR

GitHub Actions will automatically create a **"chore: version packages"** PR that updates versions in `package.json` and `CHANGELOG.md`. Review and merge it.

## 4. Automatic publish

After merging, the workflow automatically publishes new versions to npm via Trusted Publishing (OIDC).
