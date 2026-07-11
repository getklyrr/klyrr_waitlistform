import crypto from "crypto";
import { NextRequest } from "next/server";

export const SESSION_COOKIE_NAME = "klyrr_admin_session";
const SESSION_DURATION_MS = 1000 * 60 * 60 * 12; // 12 hours

function getSecret(): string {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) {
    throw new Error("ADMIN_SESSION_SECRET is not set");
  }
  return secret;
}

// Token format: "<expiryTimestamp>.<hmacHexOfExpiry>"
// Nothing sensitive is stored in the token itself, it just proves the
// server issued it (because only the server knows the secret).
export function createSessionToken(): string {
  const expiry = Date.now() + SESSION_DURATION_MS;
  const hmac = crypto.createHmac("sha256", getSecret()).update(String(expiry)).digest("hex");
  return `${expiry}.${hmac}`;
}

export function isValidSessionToken(token: string | undefined | null): boolean {
  if (!token) return false;
  const [expiryStr, hmac] = token.split(".");
  if (!expiryStr || !hmac) return false;

  const expiry = Number(expiryStr);
  if (!Number.isFinite(expiry) || expiry < Date.now()) return false;

  const expected = crypto.createHmac("sha256", getSecret()).update(expiryStr).digest("hex");

  // Constant-time comparison
  const a = Buffer.from(hmac);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

export function isAuthedRequest(req: NextRequest): boolean {
  const token = req.cookies.get(SESSION_COOKIE_NAME)?.value;
  return isValidSessionToken(token);
}
