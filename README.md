# Sequence Kit Embedded Wallet JWT Verification
Starter Sequence Embedded Wallet boilerplate that shows how to verify a JWT from your backend. 

This simple example spins up a client and server which authenticates using Sequence embedded wallets via Google auth. The `sequence.getIdToken()` is used to retrieve the JWT token from Sequence and pass this to an example backend. The JWT is deconstructed using a JWT library, verified, and then the verified information is passed back to the client for demonstration purposes.

## Quickstart
Copy `.env.example` to `.env` and fill with your project information. To test things out, you can use the pre-provided keys in the `.env.example` file:

```
cp ./client/.env.example ./client/.env
```

```
cp ./server/.env.example ./server/.env
```

Then install and run:

```js
pnpm install && pnpm start
```

The app will start on `http://localhost:5173` with the server on `http://localhost:3000`.

To provide your own keys & project IDs from [Sequence Builder](https://sequence.build/), simply edit the `.env` file accordingly in both client and server folders.
