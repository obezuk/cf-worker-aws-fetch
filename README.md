Cloudflare Workers - Amazon Signature 4 - Signed Requests to S3
====
[Cloudflare Workers](http://developers.cloudflare.com/workers/) allow you to write JavaScript which runs on all of Cloudflare's
194+ global data centers.
- This repository is an example of how to bundle [mhart's lightweight aws4fetch library](https://github.com/mhart/aws4fetch) into a Service Worker to sign requests to Amazon APIs such as S3, SQS and SNS.
- The sample Worker (`/index.js`) signs requests to an Amazon S3 bucket.
- Once you've created your bundle, you can test it without leaving your text editor! Just run `wrangler preview`

### Dependencies

- [wrangler](https://developers.cloudflare.com/workers/tooling/wrangler/install/)

### Instructions

```sh
git clone https://github.com/obezuk/cf-worker-aws-fetch.git
cd cf-worker-aws-fetch
wrangler build
```

Bundled script will be available in `./dist/main.js`
