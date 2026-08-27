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
    // ============================================
    // CONNECT DATABASE
    // ============================================

    const connected = await connectDB();

    if (!connected) {
      return NextResponse.json(
        {
          success: false,
          message: "Unable to connect to database",
        },
        { status: 500 },
      );
    }

    // ============================================
    // READ REQUEST
    // ============================================

    const body: VerifyOTPRequest = await request.json();

    const email = body.email?.trim().toLowerCase();
    const otp = body.otp?.trim();

    // ============================================
    // VALIDATION
    // ============================================

    if (!email || !otp) {
      return NextResponse.json(
        {
          success: false,
          message: "Email and OTP are required",
        },
        { status: 400 },
      );
    }

    if (!/^\d{6}$/.test(otp)) {
      return NextResponse.json(
        {
          success: false,
          message: "OTP must be 6 digits",
        },
        { status: 400 },
      );
    }

    // ============================================
    // FIND USER
    // ============================================

    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "Account not found",
        },
        { status: 404 },
      );
    }

    // ============================================
    // ALREADY VERIFIED
    // ============================================

    if (user.isVerified) {
      return NextResponse.json(
        {
          success: false,
          message: "This account is already verified",
        },
        { status: 400 },
      );
    }

    // ============================================
    // CHECK OTP EXISTS
    // ============================================

    if (!user.verificationOTP) {
      return NextResponse.json(
        {
          success: false,
          message: "No verification OTP found. Please request a new OTP.",
        },
        { status: 400 },
      );
    }

    // ============================================
    // CHECK OTP EXPIRATION
    // ============================================

    if (
      !user.verificationOTPExpires ||
      user.verificationOTPExpires < new Date()
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "OTP has expired. Please request a new OTP.",
        },
        { status: 400 },
      );
    }

    // ============================================
    // VERIFY OTP
    // ============================================

    const isValidOTP = await bcrypt.compare(otp, user.verificationOTP);

    if (!isValidOTP) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid OTP",
        },
        { status: 400 },
      );
    }

    // ============================================
    // VERIFY ACCOUNT
    // ============================================

    user.isVerified = true;

    user.verificationOTP = undefined;
    user.verificationOTPExpires = undefined;

    // Important:
    // verificationExpiresAt is no longer needed
    // once the account is verified.
    user.verificationExpiresAt = undefined;

    await user.save();

    // ============================================
    // SUCCESS
    // ============================================

    return NextResponse.json(
      {
        success: true,
        message: "Email verified successfully",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Verify OTP error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong while verifying your account",
      },
      { status: 500 },
    );
  }
}
