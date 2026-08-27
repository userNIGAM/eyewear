import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";

import User from "@/models/User";
import { connectDB } from "@/lib/mongodb";

interface VerifyOTPRequest {
  email: string;
  otp: string;
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body: VerifyOTPRequest = await request.json();

    const email = body.email?.trim().toLowerCase();
    const otp = body.otp?.trim();

    // =====================================================
    // VALIDATION
    // =====================================================

    if (!email || !otp) {
      return NextResponse.json(
        {
          success: false,
          message: "Email and OTP are required",
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

    // =====================================================
    // FIND USER
    // =====================================================

    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "Account not found",
        },
        { status: 404 }
      );
    }

    if (user.isVerified) {
      return NextResponse.json(
        {
          success: false,
          message: "Account is already verified",
        },
        { status: 400 }
      );
    }

    // =====================================================
    // CHECK ACCOUNT EXPIRATION
    // =====================================================

    if (
      user.verificationExpiresAt &&
      user.verificationExpiresAt < new Date()
    ) {
      await User.findByIdAndDelete(user._id);

      return NextResponse.json(
        {
          success: false,
          message:
            "Your 10-minute verification period has expired. Please register again.",
        },
        { status: 410 }
      );
    }

    // =====================================================
    // CHECK OTP EXPIRATION
    // =====================================================

    if (
      !user.verificationOTPExpires ||
      user.verificationOTPExpires < new Date()
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "OTP has expired. Please request a new OTP.",
        },
        { status: 410 }
      );
    }

    if (!user.verificationOTP) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Verification OTP not found. Please request a new OTP.",
        },
        { status: 400 }
      );
    }

    // =====================================================
    // VERIFY OTP
    // =====================================================

    const isValidOTP = await bcrypt.compare(
      otp,
      user.verificationOTP
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
    // VERIFY ACCOUNT
    // =====================================================

    user.isVerified = true;
    user.verificationOTP = undefined;
    user.verificationOTPExpires = undefined;
    user.verificationExpiresAt = undefined;

    await user.save();

    return NextResponse.json(
      {
        success: true,
        message:
          "Account verified successfully. You can now login.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Verify OTP error:", error);

    return NextResponse.json(
      {
        success: false,
        message:
          "Something went wrong while verifying your account",
      },
      { status: 500 }
    );
  }
}