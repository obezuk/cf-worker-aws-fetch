Workers Webpack & Rollup Examples
====
[Cloudflare Workers](http://developers.cloudflare.com/workers/) allow you to write JavaScript which runs on all of Cloudflare's
160+ global data centers.
- This repo is an example of how to combine multiple files and dependencies to create a Worker using the [Webpack](https://webpack.js.org/) or [Rollup](https://rollupjs.org/) build tools.
- The sample Worker (`src/index.js`) signs requests to an Amazon S3 bucket.
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
