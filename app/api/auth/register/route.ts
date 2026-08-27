import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";

import User from "@/models/User";
import { connectDB } from "@/lib/mongodb";
import { generateOTP } from "@/lib/auth-utils";

interface RegisterRequest {
  fullName: string;
  email: string;
  password: string;
}

export async function POST(request: NextRequest) {
  try {
    // ============================================
    // CONNECT TO DATABASE
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
    // READ REQUEST BODY
    // ============================================

    const body: RegisterRequest = await request.json();

    const fullName = body.fullName?.trim();
    const email = body.email?.trim().toLowerCase();
    const password = body.password;

    // ============================================
    // VALIDATION
    // ============================================

    if (!fullName || !email || !password) {
      return NextResponse.json(
        {
          success: false,
          message: "Full name, email and password are required",
        },
        { status: 400 },
      );
    }

    if (fullName.length < 3) {
      return NextResponse.json(
        {
          success: false,
          message: "Full name must be at least 3 characters",
        },
        { status: 400 },
      );
    }

    if (fullName.length > 50) {
      return NextResponse.json(
        {
          success: false,
          message: "Full name cannot exceed 50 characters",
        },
        { status: 400 },
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        {
          success: false,
          message: "Password must be at least 8 characters",
        },
        { status: 400 },
      );
    }

    // ============================================
    // EMAIL VALIDATION
    // ============================================

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return NextResponse.json(
        {
          success: false,
          message: "Please enter a valid email address",
        },
        { status: 400 },
      );
    }

    // ============================================
    // CHECK EXISTING USER
    // ============================================

    const existingUser = await User.findOne({
      email,
    });

    if (existingUser) {
      // Delete expired unverified account
      if (
        !existingUser.isVerified &&
        existingUser.verificationExpiresAt &&
        existingUser.verificationExpiresAt < new Date()
      ) {
        await User.findByIdAndDelete(existingUser._id);
      } else {
        return NextResponse.json(
          {
            success: false,
            field: "email",
            message: "Email is already registered",
          },
          { status: 409 },
        );
      }
    }

    // ============================================
    // HASH PASSWORD
    // ============================================

    const hashedPassword = await bcrypt.hash(password, 12);

    // ============================================
    // GENERATE OTP
    // ============================================

    const otp = generateOTP();

    const hashedOTP = await bcrypt.hash(otp, 10);

    const now = new Date();

    const verificationOTPExpires = new Date(now.getTime() + 10 * 60 * 1000);

    const verificationExpiresAt = new Date(now.getTime() + 10 * 60 * 1000);

    // ============================================
    // CREATE USER
    // ============================================

    const user = await User.create({
      fullName,
      email,
      password: hashedPassword,

      isVerified: false,

      verificationOTP: hashedOTP,
      verificationOTPExpires,
      verificationExpiresAt,
    });

    // ============================================
    // DEVELOPMENT OTP
    // ============================================

    console.log("====================================");
    console.log("Registration OTP");
    console.log("Email:", email);
    console.log("OTP:", otp);
    console.log("====================================");

    return NextResponse.json(
      {
        success: true,
        message:
          "Account created successfully. Please verify the OTP sent to your email.",

        userId: user._id.toString(),

        developmentOTP:
          process.env.NODE_ENV === "development" ? otp : undefined,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Register error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong while creating your account",
      },
      { status: 500 },
    );
  }
}
