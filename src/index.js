import { AwsClient } from 'aws4fetch'

const aws = new AwsClient({
  accessKeyId: 'XXXX',
  secretAccessKey: 'XXXX'
})

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event))
})

async function handleRequest(event) {

  var req = new Request('My S3 URL');

  var res = await aws.fetch(signedReq);

  return res;

}