import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";

import User from "@/models/User";
import { connectDB } from "@/lib/mongodb";

interface ResetPasswordRequest {
  email: string;
  otp: string;
  newPassword: string;
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body: ResetPasswordRequest =
      await request.json();

    const email = body.email?.trim().toLowerCase();
    const otp = body.otp?.trim();
    const newPassword = body.newPassword;

    // =====================================================
    // VALIDATION
    // =====================================================

    if (!email || !otp || !newPassword) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Email, OTP and new password are required",
        },
        { status: 400 }
      );
    }

    if (!/^\d{6}$/.test(otp)) {
      return NextResponse.json(
        {
          success: false,
          message: "OTP must be exactly 6 digits",
        },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        {
          success: false,
          message:
            "New password must be at least 6 characters",
        },
        { status: 400 }
      );
    }

    // =====================================================
    // FIND USER
    // =====================================================

    const user = await User.findOne({ email });

    if (!user || !user.resetOTP) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid reset request",
        },
        { status: 400 }
      );
    }

    // =====================================================
    // CHECK OTP EXPIRATION
    // =====================================================

    if (
      !user.resetOTPExpires ||
      user.resetOTPExpires < new Date()
    ) {
      user.resetOTP = undefined;
      user.resetOTPExpires = undefined;

      await user.save();

      return NextResponse.json(
        {
          success: false,
          message:
            "Password reset OTP has expired",
        },
        { status: 410 }
      );
    }

    // =====================================================
    // VERIFY OTP
    // =====================================================

    const isValidOTP = await bcrypt.compare(
      otp,
      user.resetOTP
    );

    if (!isValidOTP) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid OTP",
        },
        { status: 400 }
      );
    }

    // =====================================================
    // HASH NEW PASSWORD
    // =====================================================

    user.password = await bcrypt.hash(
      newPassword,
      12
    );

    // =====================================================
    // CLEAR RESET INFORMATION
    // =====================================================

    user.resetOTP = undefined;
    user.resetOTPExpires = undefined;

    await user.save();

    return NextResponse.json(
      {
        success: true,
        message:
          "Password reset successfully. You can now login.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(
      "Reset password error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message: "Unable to reset password",
      },
      { status: 500 }
    );
  }
}