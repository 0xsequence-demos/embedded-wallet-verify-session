# Sequence Embedded Wallet JWT Verification

Starter Sequence Embedded Wallet boilerplate that shows how to verify a JWT from your backend.

This simple example is built as a cloudflare page, providing a client and a backend function. A user authenticates using Sequence embedded wallets via Google auth. The `sequence.getIdToken()` is used to retrieve the JWT token from Sequence and pass this to an example backend. The JWT is deconstructed using a JWT library, verified, and then the verified information is passed back to the client for demonstration purposes.

## Quickstart

Copy `.env.example` to `.env`, and `wrangler.example.toml` to `wrangler.toml` and fill with your project information. To test things out, you can use the pre-provided keys in those files:

```
cp ./.env.example ./.env && cp ./wrangler.example.toml ./wrangler.toml
```

Then install and run:

```js
pnpm install && pnpm dev:cf
```

Wrangler will serve the front-end and provide the backend function at `/api/verify-wallet`. The app will be served at `http://localhost:4444`, 

To provide your own keys & project IDs from [Sequence Builder](https://sequence.build/), simply edit the `.env` file and `wrangler.toml`.
