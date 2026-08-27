import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";

import User from "@/models/User";
import { connectDB } from "@/lib/mongodb";
import {
  generateToken,
  sanitizeUser,
  setAuthCookie,
} from "@/lib/auth-utils";

interface LoginRequest {
  identifier: string;
  password: string;
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body: LoginRequest = await request.json();

    const identifier = body.identifier?.trim().toLowerCase();
    const password = body.password;

    // =====================================================
    // VALIDATION
    // =====================================================

    if (!identifier || !password) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Username/email and password are required",
        },
        { status: 400 }
      );
    }

    // =====================================================
    // FIND USER
    // =====================================================

    const user = await User.findOne({
      $or: [
        { email: identifier },
        { username: identifier },
      ],
    });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Invalid username/email or password",
        },
        { status: 401 }
      );
    }

    // =====================================================
    // CHECK VERIFICATION
    // =====================================================

    if (!user.isVerified) {
      if (
        user.verificationExpiresAt &&
        user.verificationExpiresAt < new Date()
      ) {
        await User.findByIdAndDelete(user._id);

        return NextResponse.json(
          {
            success: false,
            message:
              "Your account verification period has expired. Please register again.",
          },
          { status: 410 }
        );
      }

      return NextResponse.json(
        {
          success: false,
          message:
            "Please verify your email before logging in.",
          requiresVerification: true,
          email: user.email,
        },
        { status: 403 }
      );
    }

    // =====================================================
    // CHECK PASSWORD
    // =====================================================

    const passwordValid = await bcrypt.compare(
      password,
      user.password
    );

    if (!passwordValid) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Invalid username/email or password",
        },
        { status: 401 }
      );
    }

    // =====================================================
    // GENERATE JWT
    // =====================================================

    const token = generateToken(
      user._id.toString()
    );

    // =====================================================
    // CREATE RESPONSE
    // =====================================================

    const response = NextResponse.json(
      {
        success: true,
        message: "Login successful",
        user: sanitizeUser(user),
      },
      { status: 200 }
    );

    // =====================================================
    // SET HTTP-ONLY COOKIE
    // =====================================================

    setAuthCookie(response, token);

    return response;
  } catch (error) {
    console.error("Login error:", error);

    return NextResponse.json(
      {
        success: false,
        message:
          "Something went wrong while logging in",
      },
      { status: 500 }
    );
  }
}