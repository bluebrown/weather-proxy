# Weather Proxy

Cloudflare worker to add cors headers to requests to <https://www.metaweather.com/>

## Prerequisites

In order to run this worker you need a free cloudflare account and an access token to manage workers.

## Setup

Update the account id in the *wrangler.toml* to your own account id that you can find in cloudflare in the worker tab.

```toml
name = "weather-proxy"
type = "javascript"
account_id = "your account id"
workers_dev = true
route = ""
zone_id = ""
```

If you are planning to deploy this, and make requests to it, you need to change the variable `ALLOWED_ORIGIN` in the *index.js*

```javascript
const ALLOWED_ORIGIN = "your origin or maybe *"
```

## Development

For local development and deployment to cloudflare use the [wrangler cli](https://developers.cloudflare.com/workers/cli-wrangler)

```console
wrangler dev
```

## Deployment

The project can be deployed directly with wrangler.

```console
wrangler publish
```

However, there is a workflow in the .github folder that will deploy automatically on release, assuming everything is correctly configured. Meaning if the account id is correct and the access token has been added to the github repositories secrets under the name `CF_API_TOKEN`.

```yml
name: Deploy
steps:
  - uses: actions/checkout@v2
  - name: Publish
    uses: cloudflare/wrangler-action@1.3.0
    with:
      apiToken: ${{ secrets.CF_API_TOKEN }}
```
