const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,HEAD,POST,OPTIONS",
  "Access-Control-Max-Age": "86400",
}

const wHost = "https://www.metaweather.com"

const PROXY_ENDPOINT = "/"

async function handleRequest(request) {
  const url = new URL(request.url)
  let apiUrl = wHost + url.pathname + url.search
  
  request = new Request(apiUrl, request)
  request.headers.set("Origin", new URL(apiUrl).origin)

  const cacheUrl = new URL(request.url)
  const cacheKey = new Request(cacheUrl.toString(), request)
  const cache = caches.default

  let response = await cache.match(cacheKey)

  if (response) return response

  let response = await fetch(request)

  response = new Response(response.body, response)

  response.headers.set("Access-Control-Allow-Origin", '*')

  response.headers.append("Vary", "Origin")

  response.headers.append("Cache-Control", "s-maxage=3600")

  await cache.put(cacheKey, response.clone())

  return response
}

function handleOptions(request) {
  let headers = request.headers;
  if (
    headers.get("Origin") !== null &&
    headers.get("Access-Control-Request-Method") !== null &&
    headers.get("Access-Control-Request-Headers") !== null
  ) {
    let respHeaders = {
      ...corsHeaders,
      "Access-Control-Allow-Headers": request.headers.get("Access-Control-Request-Headers"),
    }
    console.log(respHeaders)
    return new Response(null, {
      headers: respHeaders,
    })
  }
  else {
    return new Response(null, {
      headers: {
        Allow: "GET, HEAD, POST, OPTIONS",
      },
    })
  }
}

addEventListener("fetch", event => {
  const request = event.request
  if (request.method === "OPTIONS") {
    // Handle CORS preflight requests
    event.respondWith(handleOptions(request))
  }
  else if (
    request.method === "GET" ||
    request.method === "HEAD" ||
    request.method === "POST"
  ) {
    // Handle requests to the API server
    event.respondWith(handleRequest(request))
  }
  else {
    event.respondWith(
      new Response(null, {
        status: 405,
        statusText: "Method Not Allowed",
      }),
    )
  }
})