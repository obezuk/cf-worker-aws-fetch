import { AwsClient } from 'aws4fetch'

const aws = new AwsClient({
  accessKeyId: 'XXXX',
  secretAccessKey: 'XXXX'
})

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event))
});

async function handleRequest(event) {

  var request = event.request;

  var url = new URL(event.request.url);
  var queue = 'https://sqs.ap-southeast-2.amazonaws.com/1234512345/worker-queue';
  var sqs = new URL(queue);
  sqs.searchParams.set('Action', 'SendMessage');
  sqs.searchParams.set('Version', '2012-11-05');
  sqs.searchParams.set('MessageBody', 'Hello World!');

  return await aws.fetch(url);

}