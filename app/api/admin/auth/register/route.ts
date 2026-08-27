import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";

import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      fullName,
      email,
      password,
      adminSecret,
    } = body;

    // Validate fields
    if (!fullName || !email || !password || !adminSecret) {
      return NextResponse.json(
        {
          success: false,
          message: "All fields are required",
        },
        { status: 400 },
      );
    }

    // Check admin registration secret
    if (adminSecret !== process.env.ADMIN_REGISTER_SECRET) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid admin registration secret",
        },
        { status: 403 },
      );
    }

    // Validate password
    if (password.length < 8) {
      return NextResponse.json(
        {
          success: false,
          message: "Password must be at least 8 characters",
        },
        { status: 400 },
      );
    }

    await connectDB();

    const normalizedEmail = email.trim().toLowerCase();

    // Check existing account
    const existingUser = await User.findOne({
      email: normalizedEmail,
    });

    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          message: "An account with this email already exists",
        },
        { status: 409 },
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create admin
    const admin = await User.create({
      fullName: fullName.trim(),
      email: normalizedEmail,
      password: hashedPassword,

      // IMPORTANT:
      // Admin role is assigned ONLY by this backend.
      role: "admin",

      isVerified: true,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Admin account created successfully",
        admin: {
          id: admin._id,
          fullName: admin.fullName,
          email: admin.email,
          role: admin.role,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Admin registration error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong while creating the admin account",
      },
      { status: 500 },
    );
  }
}