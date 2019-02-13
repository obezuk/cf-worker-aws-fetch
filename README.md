Workers Webpack & Rollup Examples
====
[Cloudflare Workers](http://developers.cloudflare.com/workers/) allow you to write JavaScript which runs on all of Cloudflare's
160+ global data centers. This repo is an example of how to combine multiple files and dependencies to create a Worker using
the [Webpack](https://webpack.js.org/) or [Rollup](https://rollupjs.org/) build tools.
> Note: the Rollup config in this project supports Node-style `require()` and ES6 `import`

- The sample Worker (`src/index.js`) replaces the content of your site with a Worker which returns the current time in the timezone of the caller's choice.
- Once you've created your bundle, you can test it without leaving your text editor! Just run `npm run preview url=https://google.com?tz=America/New_York`

### Dependencies

- [npm](https://www.npmjs.com/get-npm)
- [jq](https://stedolan.github.io/jq/) (for the preview script)
- [cURL](https://curl.haxx.se/) (for the preview script)

### Instructions

```sh
git clone https://github.com/obezuk/cf-worker-aws-fetch.git
cd cf-worker-aws-fetch
npm install

```

```sh
# Build with Webpack
npm run build

# Build with Rollup (ES6 modules)
npm run rollup

# Build with Rollup (CommonJS)
npm run rollup:cjs

# Build with Rollup (UMD)
npm run rollup:umd
```

```sh
# Open the Workers preview with the built Worker:
npm run preview url=https://www.cloudflare.com
```
