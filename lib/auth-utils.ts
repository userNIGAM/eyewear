import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export const AUTH_COOKIE_NAME = "auth_token";
export const AUTH_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;

// =========================================================
// TYPES
// =========================================================

export type UserRole = "user" | "admin";

export interface JWTPayload {
  userId: string;
  role: UserRole;
}

interface SanitizableUser {
  _id: {
    toString(): string;
  };
  name?: string;
  fullName?: string;
  email: string;
  role?: UserRole;
  isVerified: boolean;
  createdAt: Date;
}

// =========================================================
// GENERATE OTP
// =========================================================

export function generateOTP(length: number = 6): string {
  const min = 10 ** (length - 1);
  const max = 10 ** length - 1;

  return Math.floor(min + Math.random() * (max - min + 1)).toString();
}

// =========================================================
// GENERATE JWT
// =========================================================

export const generateToken = (userId: string, role: UserRole): string => {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET is not configured");
  }

  return jwt.sign(
    {
      userId,
      role,
    },
    secret,
    {
      expiresIn: "7d",
    },
  );
};

// =========================================================
// VERIFY JWT
// =========================================================

export const verifyToken = (token: string): JWTPayload | null => {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET is not configured");
  }

  try {
    const decoded = jwt.verify(token, secret);
    if (
      typeof decoded === "string" ||
      !decoded.userId ||
      (decoded.role !== "user" && decoded.role !== "admin")
    ) {
      return null;
    }
    return {
      userId: decoded.userId,
      role: decoded.role,
    };
  } catch {
    return null;
  }
};

// =========================================================
// SANITIZE USER
// =========================================================

export const sanitizeUser = (user: SanitizableUser) => {
  return {
    id: user._id.toString(),
    name: user.name ?? user.fullName ?? "",
    email: user.email,
    role: user.role ?? "user",
    isVerified: user.isVerified,
    createdAt: user.createdAt,
  };
};

// =========================================================
// SET AUTH COOKIE
// =========================================================

export const setAuthCookie = (response: NextResponse, token: string) => {
  response.cookies.set({
    name: AUTH_COOKIE_NAME,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: AUTH_COOKIE_MAX_AGE,
  });
};

// =========================================================
// CLEAR AUTH COOKIE
// =========================================================

export const clearAuthCookie = (response: NextResponse) => {
  response.cookies.set({
    name: AUTH_COOKIE_NAME,
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
    expires: new Date(0),
  });
};
