import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { ethers } from 'ethers'
import { Session } from '@0xsequence/auth'
import { findSupportedNetwork, NetworkConfig } from '@0xsequence/network'
import jwt from 'jsonwebtoken';
import jwksClient from 'jwks-rsa';
import { promisify } from 'util';


const PORT = 3000
const app = express()

const corsOptions = {
    origin: '*',
};

app.use(express.json());
app.use(cors(corsOptions))

// Initialize the JWKS client
const client = jwksClient({
    jwksUri: 'https://waas.sequence.app/.well-known/jwks.json',
    cache: true,
    cacheMaxAge: 86400000, // 1 day
  });

// Promisify the getSigningKey function
const getSigningKey = promisify(client.getSigningKey);

// Should be equal to the audience claim in the JWT that you want to verify which will be of the form https://api.sequence.build/project/*projectID*
const EXPECTED_AUDIENCE = process.env.BUILDER_API_ID!;

// Middleware to verify JWT
async function verifyJWT(token: string): Promise<jwt.JwtPayload> {
    const decodedToken = jwt.decode(token, { complete: true });
    console.log(decodedToken)
    if (!decodedToken || typeof decodedToken === 'string') {
      throw new Error('Invalid token');
    }
  
    const kid = decodedToken.header.kid;
    const signingKey = await getSigningKey(kid);
    const publicKey = (signingKey as jwksClient.CertSigningKey | jwksClient.RsaSigningKey).getPublicKey();
  
    const verified = jwt.verify(token, publicKey, {
      algorithms: ['RS256'], // Specify the expected algorithm
      audience: EXPECTED_AUDIENCE, // Verify the audience claim
    }) as jwt.JwtPayload;
  
    // Verify additional claims
    if (!verified.sub || typeof verified.sub !== 'string') {
      throw new Error('Invalid sub claim');
    }
  
    if (!verified.iat || !verified.exp || typeof verified.iat !== 'number' || typeof verified.exp !== 'number') {
      throw new Error('Invalid iat or exp claim');
    }
  
    if (verified.exp < Math.floor(Date.now() / 1000)) {
      throw new Error('Token has expired');
    }
  
    if (!verified.email || typeof verified.email !== 'string') {
      throw new Error('Invalid email claim');
    }
    return verified;
  }

  app.post('/verifyWallet', async (req, res) => {
    const { sequenceToken } = req.body as { sequenceToken?: string };

  
    if (!sequenceToken) {
      return res.status(400).json({ error: 'No token provided' });
    }

    interface VerifiedJWT {
        sub: string;
        email: string;
        iat: number;
        exp: number;
      }
  
    try {
      const verified = await verifyJWT(sequenceToken) as VerifiedJWT;
      
      const walletInfo = {
        walletAddress: verified.sub,
        email: verified.email,
        iat: verified.iat,
        exp: verified.exp,
      };
      res.json({ message: 'Wallet verified successfully', wallet: walletInfo });
    } catch (error) {
      res.status(401).json({ error: (error as Error).message || 'Invalid token' });
    }
  });

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
})