# @sphido/dev

Watch mode and dev server with live reload for [Sphido](https://sphido.cz). Edit a file in `content/` → the site
rebuilds → the browser reloads. No bundler, no magic — a thin wrapper around `node:fs.watch` and `node:http` with
zero runtime dependencies (Node 22 stdlib only).

## Install

```bash
pnpm add -D @sphido/dev
```

## Usage

```javascript
import {serve} from '@sphido/dev';

await serve({
  watch: ['content'],          // directories to watch (default: ['content'])
  output: 'public',            // directory to serve (default: 'public')
  build: async () => { ... },  // your existing build function (required)
  port: 4000,                  // optional, default 4000
});
```

`serve()` runs the initial `build()`, starts a static server over `output`, watches the `watch` directories and
triggers a rebuild on every change (debounced, builds never overlap). After each successful rebuild every connected
browser reloads automatically via a tiny injected script and a server-sent events endpoint (`/__sphido_reload`).
A crashing `build()` is printed to the console and the server keeps running.

It returns a handle:

```typescript
const {url, close} = await serve({build});
console.log(url);  // http://localhost:4000/
await close();     // stop watching, disconnect clients, close the server
```

## Recipe: plug in an existing `index.js`

Export your build as a function and call `serve()` behind a `--dev` flag (or a `NODE_ENV` check):

```javascript
// index.js
import {serve} from '@sphido/dev';

export async function build() {
  // ... your existing Sphido build: read content/, render pages into public/
}

if (process.argv.includes('--dev') || process.env.NODE_ENV !== 'production') {
  await serve({watch: ['content'], output: 'public', build});
} else {
  await build();
}
```

Then start the dev loop with:

```bash
node index.js --dev
```

## API

### `serve(options: ServeOptions): Promise<ServeHandle>`

```typescript
interface ServeOptions {
  watch?: string[];                   // dirs to watch, default ['content']
  output?: string;                    // dir to serve, default 'public'
  build: () => void | Promise<void>;  // user build function (required)
  port?: number;                      // default 4000, pass 0 for a random free port
}

interface ServeHandle {
  url: string;                // local URL the server is listening on
  close(): Promise<void>;     // shut everything down
}
```

## License

[MIT](LICENSE)
