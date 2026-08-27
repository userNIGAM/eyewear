import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

// =========================================================
// TYPES
// =========================================================

export interface JWTPayload {
  userId: string;
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

export const sanitizeUser = (user: any) => {
  return {
    id: user._id.toString(),
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
    name: "auth_token",
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
};

// =========================================================
// CLEAR AUTH COOKIE
// =========================================================

export const clearAuthCookie = (response: NextResponse) => {
  response.cookies.set({
    name: "auth_token",
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: new Date(0),
  });
};



