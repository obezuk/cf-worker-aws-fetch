import { AwsClient } from 'aws4fetch'

const aws = new AwsClient({
  accessKeyId: 'XXXX',
  secretAccessKey: 'XXXX'
})

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event))
});a``

async function handleRequest(event) {

  var request = event.request;

  var url = new URL(event.request.url);

  var bucketHostname = 'example.s3.ap-southeast-2.amazonaws.com';
  url.hostname = bucketHostname;

  return await aws.fetch(url);

}