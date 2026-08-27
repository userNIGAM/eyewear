import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined");
}

export interface AuthTokenPayload {
  userId: string;
  role: "user" | "admin";
}

export function createAuthToken(payload: AuthTokenPayload) {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: "7d",
  });
}

export function verifyAuthToken(token: string): AuthTokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as AuthTokenPayload;
  } catch {
    return null;
  }
}

export async function getCurrentUser() {
  const cookieStore = await cookies();

  const token = cookieStore.get("auth_token")?.value;

  if (!token) {
    return null;
  }

  return verifyAuthToken(token);
}

export async function requireAdmin() {
  const user = await getCurrentUser();

  if (!user || user.role !== "admin") {
    return null;
  }

  return user;
}
