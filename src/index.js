import { AwsClient } from 'aws4fetch'

const aws = new AwsClient({
  accessKeyId: 'XXXX',
  secretAccessKey: 'XXXX'
})

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event))
});

async function putS3(url, response) {
  if ((response.status >= 200) && (response.status < 300)) {
    var s3Headers = new Headers();
    if (response.headers.has('Content-Type')) {
      s3Headers.set('Content-Type', response.headers.get('Content-Type'));
    } else {
      s3Headers.set('Content-Type', 'text/plain');
    }
    var uploadRequest = new Request(url, {
      "method": 'PUT',
      "headers": s3Headers,
      "body": response.body
    });
    return aws.fetch(uploadRequest);
  } else {
    return;
  }
}

async function handleRequest(event) {

  var benchStart = new Date().getTime();
  var request = event.request;

  var sourceHostname = 'obezuk-s3-source.s3.ap-southeast-2.amazonaws.com';
  var chinaOriginHostname = 'obezuk-s3-target.s3.ap-southeast-2.amazonaws.com';

  if (request.method != 'GET') { // If request method is not GET, Bypass and forward unmodified.
    var res = await fetch(request);
    var headers = new Headers(res.headers);
    var benchEnd = new Date().getTime();
    headers.set('worker-cn-duration-ms', benchEnd - benchStart);
    headers.set('worker-cn-status', 'BYPASS');
    headers.set('worker-cn-status-message', 'Only GET method requests supported.');
    return new Response(res.body, {
      "headers": headers
    });
  }

  // if (request.cf.country != 'CN') { // If request is not from ML-China, Bypass and forward unmodified.
  //   var res = await fetch(request);
  //   var headers = new Headers(res.headers);
  //   headers.set('worker-cn-status', 'BYPASS');
  //   headers.set('worker-cn-status-message', 'Request does not originate in Mainland China.');
  //   return new Response(res.body, {
  //     "headers" : headers
  //   });
  // }

  var cache = caches.default;

  var cachedResponse = await cache.match(request);

  if (cachedResponse) {
    var headers = new Headers(cachedResponse.headers);
    var benchEnd = new Date().getTime();
    headers.set('worker-cn-duration-ms', benchEnd - benchStart);
    headers.set('worker-cn-cache-api-status', 'HIT');
    return new Response(cachedResponse.body, {
      "headers": headers
    });
  }

  var modifiedSourceUrl = new URL(request.url);
  modifiedSourceUrl.hostname = sourceHostname;

  var modifiedRequest = new Request(modifiedSourceUrl, {
    'headers': request.headers
  });
  var fetchOptions = {
    'cf': {
      'cacheTtl': -1
    }
  };

  var cnOriginURL = new URL(modifiedRequest.url);
  cnOriginURL.hostname = chinaOriginHostname;
  cnOriginURL.protocol = 'http:';
  var cnOriginRequest = new Request(cnOriginURL, {
    'headers': modifiedRequest.headers
  });

  var cnOriginResponse = await fetch(cnOriginRequest, fetchOptions);

  if ((cnOriginResponse.status >= 200) && (cnOriginResponse.status < 300)) {
    var headers = new Headers(cnOriginResponse.headers);
    headers.set('worker-cn-status', 'HIT');
    headers.set('worker-cn-statuscode', cnOriginResponse.status);
    headers.set('worker-cn-status-message', 'China origin fulfilled request.');
    var response = cnOriginResponse;

    // Range Requests: If a range request is made for an uncached asset, fetch range from origin and open a separate full connection to download the object so future range requests are served from cache.

    if (cnOriginRequest.headers.has('range')) {
      headers.set('worker-cn-status-range', 'Caching full object from CN');
      var cnStripRangeRequest = new Request(cnOriginRequest.url);
      var cnStripRangeResponse = await fetch(cnStripRangeRequest);
      event.waitUntil(cache.put(request, cnStripRangeResponse)); // Cache the full response.
    }

  } else { // Fallback to default origin server.
    var response = await fetch(modifiedRequest, fetchOptions);
    var headers = new Headers(response.headers);
    headers.set('worker-cn-status', 'MISS');
    headers.set('worker-cn-statuscode', cnOriginResponse.status);
    headers.set('worker-us-statuscode', response.status);
    headers.set('worker-cn-status-message', 'China origin returned a non-200 response.');

    // Range Requests: If a range request is made for an uncached asset, fetch range from origin and open a separate full connection to download the object so future range requests are served from cache.

    if (modifiedRequest.headers.has('range')) {
      var stripRangeRequest = new Request(modifiedRequest.url);
      var stripRangeResponse = await fetch(stripRangeRequest);
      headers.set('worker-cn-status-range', 'Caching full object from US');
      event.waitUntil(cache.put(request, stripRangeResponse.clone())); // Cache the full response.
      event.waitUntil(putS3(cnOriginRequest.url, stripRangeResponse));
    } else {
      event.waitUntil(putS3(cnOriginRequest.url, response.clone()));
    }
  }

  if (headers.has('Cache-Control')) {
    headers.delete('Cache-Control');
  }

  headers.set('Expires', 'Tue, 01 Jan 2030 00:00:00 GMT');

  var benchEnd = new Date().getTime();
  headers.set('worker-cn-duration-ms', benchEnd - benchStart);

  var result = new Response(response.body, {
    "headers": headers
  });

  if (!modifiedRequest.headers.has('range')) { // Don't Cache Range Requests. Subsequent Range Requests will be served from cache when the full payload is transferred.
    event.waitUntil(cache.put(request, result.clone()));
  }

  return result;
}