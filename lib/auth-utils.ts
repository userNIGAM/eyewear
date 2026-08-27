import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export const AUTH_COOKIE_NAME = "auth_token";
export const AUTH_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;

// =========================================================
// TYPES
// =========================================================

export interface JWTPayload {
  userId: string;
}

interface SanitizableUser {
  _id: {
    toString(): string;
  };
  fullName?: string;
  username?: string;
  email: string;
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

export const generateToken = (userId: string): string => {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET is not configured");
  }

  return jwt.sign(
    {
      userId,
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
    const decoded = jwt.verify(token, secret) as JWTPayload;

    if (!decoded.userId) {
      return null;
    }

    return decoded;
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
    fullName: user.fullName ?? user.username ?? "",
    username: user.username,
    email: user.email,
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



