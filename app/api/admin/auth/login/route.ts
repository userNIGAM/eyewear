import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";

import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { createAuthToken, type UserRole } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();


const { email, password } = body;

// =====================================================
// VALIDATION
// =====================================================

if (!email || !password) {
  return NextResponse.json(
    {
      success: false,
      message: "Email and password are required",
    },
    {
      status: 400,
    },
  );
}

await connectDB();

const normalizedEmail = email.trim().toLowerCase();

// =====================================================
// FIND USER
// =====================================================

const user = await User.findOne({
  email: normalizedEmail,
});

if (!user) {
  return NextResponse.json(
    {
      success: false,
      message: "Invalid email or password",
    },
    {
      status: 401,
    },
  );
}

// =====================================================
// ADMIN ROLE CHECK
// =====================================================

if (user.role !== "admin") {
  return NextResponse.json(
    {
      success: false,
      message: "You do not have administrator access",
    },
    {
      status: 403,
    },
  );
}

// =====================================================
// PASSWORD CHECK
// =====================================================

const passwordMatches = await bcrypt.compare(
  password,
  user.password,
);

if (!passwordMatches) {
  return NextResponse.json(
    {
      success: false,
      message: "Invalid email or password",
    },
    {
      status: 401,
    },
  );
}

// =====================================================
// CREATE ADMIN TOKEN
// =====================================================

const role: UserRole = "admin";

const token = createAuthToken({
  userId: user._id.toString(),
  role,
});

// =====================================================
// CREATE RESPONSE
// =====================================================

const response = NextResponse.json(
  {
    success: true,
    message: "Admin login successful",
    admin: {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role,
    },
  },
  {
    status: 200,
  },
);

// =====================================================
// SET AUTH COOKIE
// =====================================================

response.cookies.set({
  name: "auth_token",
  value: token,
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  path: "/",
  maxAge: 60 * 60 * 24 * 7,
});

return response;

  } catch (error) {
    console.error("Admin login error:", error);

return NextResponse.json(
  {
    success: false,
    message: "Something went wrong during login",
  },
  {
    status: 500,
  },
);
  }
}
