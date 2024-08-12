import { decodeProtectedHeader, JWK, jwtVerify } from "jose";

export interface IEnv {
  EXPECTED_AUDIENCE: string;
}
interface Ijwks {
  keys: JWK[];
}

let jwksPromise: Promise<Ijwks>;

function getJwks() {
  if (!jwksPromise) {
    jwksPromise = fetch("https://waas.sequence.app/.well-known/jwks.json").then(
      (resp) => resp.json() as unknown as Ijwks,
    );
  }
  return jwksPromise;
}


// Middleware to verify JWT
async function verifyJWT(token: string, audience: string) {
  const jwks = await getJwks();
  const decodedHeader = decodeProtectedHeader(token);
  const kid = decodedHeader.kid;
  const signingKey = jwks.keys.find((k) => k.kid === kid);
  if (!signingKey) {
    throw new Error("No signing key found with matching kid");
  }
  return await jwtVerify(token, signingKey, { audience });
}

export const onRequest: PagesFunction<IEnv> = async (ctx) => {
  const { sequenceToken } = (await ctx.request.json()) as {
    sequenceToken?: string;
  };

  if (!sequenceToken) {
    return new Response(JSON.stringify({ error: "No token provided" }), {
      status: 400,
    });
  }

  try {
    const verified = await verifyJWT(sequenceToken, `https://sequence.build/project/${ctx.env.BUILDER_PROJECT_ID}`);

    const walletInfo = {
      walletAddress: verified.payload.sub,
      email: verified.payload.email,
      iat: verified.payload.iat,
      exp: verified.payload.exp,
    };
    return new Response(
      JSON.stringify({
        message: "Wallet verified successfully",
        wallet: walletInfo,
      }),
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: (error as Error).message || "Invalid token" }),
      { status: 401 },
    );
  }
};
