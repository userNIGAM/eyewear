import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";

import User from "@/models/User";
import { connectDB } from "@/lib/mongodb";
import { generateOTP } from "@/lib/auth-utils";

interface ForgotPasswordRequest {
  email: string;
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body: ForgotPasswordRequest =
      await request.json();

    const email = body.email?.trim().toLowerCase();

    if (!email) {
      return NextResponse.json(
        {
          success: false,
          message: "Email is required",
        },
        { status: 400 }
      );
    }

    const user = await User.findOne({ email });

    // Don't reveal whether an account exists
    if (!user) {
      return NextResponse.json(
        {
          success: true,
          message:
            "If an account exists with this email, a password reset OTP has been sent.",
        },
        { status: 200 }
      );
    }

    if (!user.isVerified) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Please verify your account before resetting your password.",
        },
        { status: 403 }
      );
    }

    // =====================================================
    // GENERATE RESET OTP
    // =====================================================

    const otp = generateOTP();

    const hashedOTP = await bcrypt.hash(otp, 10);

    user.resetOTP = hashedOTP;

    user.resetOTPExpires = new Date(
      Date.now() + 10 * 60 * 1000
    );

    await user.save();

    // =====================================================
    // SEND RESET OTP
    // =====================================================

    // TODO:
    // Replace with email service.
    console.log(
      `Password reset OTP for ${email}: ${otp}`
    );

    return NextResponse.json(
      {
        success: true,
        message:
          "If an account exists with this email, a password reset OTP has been sent.",

        // Development only
        developmentOTP:
          process.env.NODE_ENV === "development"
            ? otp
            : undefined,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Forgot password error:", error);

    return NextResponse.json(
      {
        success: false,
        message:
          "Unable to process password reset request",
      },
      { status: 500 }
    );
  }
}