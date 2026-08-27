import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";

import User from "@/models/User";
import { connectDB } from "@/lib/mongodb";
import { generateOTP } from "@/lib/auth-utils";

interface ResendOTPRequest {
  email: string;
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body: ResendOTPRequest = await request.json();

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
            "Your verification period has expired. Please register again.",
        },
        { status: 410 }
      );
    }

    // =====================================================
    // GENERATE NEW OTP
    // =====================================================

    const otp = generateOTP();
    const hashedOTP = await bcrypt.hash(otp, 10);

    user.verificationOTP = hashedOTP;

    user.verificationOTPExpires = new Date(
      Date.now() + 10 * 60 * 1000
    );

    await user.save();

    // =====================================================
    // SEND OTP
    // =====================================================

    // TODO:
    // Replace this with email service.
    console.log(`New OTP for ${email}: ${otp}`);

    return NextResponse.json(
      {
        success: true,
        message: "A new OTP has been sent to your email.",

        // Development only
        developmentOTP:
          process.env.NODE_ENV === "development"
            ? otp
            : undefined,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Resend OTP error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to resend OTP",
      },
      { status: 500 }
    );
  }
}