import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";

import User from "@/models/User";
import { connectDB } from "@/lib/mongodb";

interface VerifyResetOTPRequest {
  email: string;
  otp: string;
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body: VerifyResetOTPRequest =
      await request.json();

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

    if (!user || !user.resetOTP) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid OTP",
        },
        { status: 400 }
      );
    }

    // =====================================================
    // CHECK EXPIRATION
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
          message: "Password reset OTP has expired",
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

    return NextResponse.json(
      {
        success: true,
        message:
          "OTP verified successfully. You can now reset your password.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(
      "Verify reset OTP error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message: "Unable to verify reset OTP",
      },
      { status: 500 }
    );
  }
}