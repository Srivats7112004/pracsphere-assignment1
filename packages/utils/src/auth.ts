import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";

const ALG = "HS256";

export async function hashPassword(plain: string) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(plain, salt);
}
export function comparePassword(plain: string, hash: string) {
  return bcrypt.compare(plain, hash);
}

export async function signSession(payload: object, secret: string) {
  return await new SignJWT(payload as any)
    .setProtectedHeader({ alg: ALG })
    .setExpirationTime("7d")
    .setIssuedAt()
    .sign(new TextEncoder().encode(secret));
}
export async function verifySession(token: string, secret: string) {
  const { payload } = await jwtVerify(
    token,
    new TextEncoder().encode(secret),
    { algorithms: [ALG] }
  );
  return payload;
}
