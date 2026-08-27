import { NextRequest, NextResponse } from "next/server";

import User from "@/models/User";
import { connectDB } from "@/lib/mongodb";
import {
  clearAuthCookie,
  sanitizeUser,
  verifyToken,
} from "@/lib/auth-utils";

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    // =====================================================
    // GET COOKIE
    // =====================================================

    const token =
      request.cookies.get("auth_token")?.value;

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          message: "Not authenticated",
        },
        { status: 401 }
      );
    }

    // =====================================================
    // VERIFY JWT
    // =====================================================

    const decoded = verifyToken(token);

    if (!decoded) {
      const response = NextResponse.json(
        {
          success: false,
          message: "Invalid or expired session",
        },
        { status: 401 }
      );

      clearAuthCookie(response);

      return response;
    }

    // =====================================================
    // FIND USER
    // =====================================================

    const user = await User.findById(decoded.userId);

    if (!user) {
      const response = NextResponse.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 }
      );

      clearAuthCookie(response);

      return response;
    }

    // =====================================================
    // RETURN USER
    // =====================================================

    return NextResponse.json(
      {
        success: true,
        user: sanitizeUser(user),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Get user error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to get user information",
      },
      { status: 500 }
    );
  }
}
