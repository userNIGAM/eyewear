import jwt, { JwtPayload } from "jsonwebtoken";
import { cookies } from "next/headers";

export type UserRole = "user" | "admin";

export interface AuthTokenPayload extends JwtPayload {
  userId: string;
  role: UserRole;
}

const getJwtSecret = (): string => {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET is not defined");
  }

  return secret;
};

// =========================================================
// CREATE AUTH TOKEN
// =========================================================

export function createAuthToken(payload: AuthTokenPayload): string {
  return jwt.sign(
    {
      userId: payload.userId,
      role: payload.role,
    },
    getJwtSecret(),
    {
      expiresIn: "7d",
    },
  );
}

// =========================================================
// VERIFY AUTH TOKEN
// =========================================================

export function verifyAuthToken(token: string): AuthTokenPayload | null {
  try {
    const decoded = jwt.verify(token, getJwtSecret());

    if (
      typeof decoded === "string" ||
      !decoded.userId ||
      (decoded.role !== "user" && decoded.role !== "admin")
    ) {
      return null;
    }

    return decoded as AuthTokenPayload;
  } catch {
    return null;
  }
}

// =========================================================
// GET CURRENT USER
// =========================================================

export async function getCurrentUser(): Promise<AuthTokenPayload | null> {
  const cookieStore = await cookies();

  const token = cookieStore.get("auth_token")?.value;

  if (!token) {
    return null;
  }

  return verifyAuthToken(token);
}

// =========================================================
// REQUIRE ADMIN
// =========================================================

export async function requireAdmin(): Promise<AuthTokenPayload | null> {
  const user = await getCurrentUser();

  if (!user || user.role !== "admin") {
    return null;
  }

  return user;
}
