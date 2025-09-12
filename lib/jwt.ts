import { JWTPayload, SignJWT, jwtVerify } from 'jose';
export interface TokenPayload extends JWTPayload {
  userId: number;
  role: string;
}

const SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-secret-key'
);

export async function signJwt(payload: JWTPayload, expiresIn: string) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime(expiresIn)
    .sign(SECRET);
}

export async function verifyJwt(token: string): Promise<TokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET);
    return payload as TokenPayload;
  } catch (err) {
    console.error('JWT verification failed:', err);
    return null;
  }
}
