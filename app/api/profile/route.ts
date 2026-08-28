import { NextRequest, NextResponse } from "next/server";

import User from "@/models/User";
import { connectDB } from "@/lib/mongodb";
import { getCurrentUser } from "@/lib/auth";

// =========================================================
// GET PROFILE
// =========================================================

export async function GET() {
  try {
    await connectDB();

    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        {
          status: 401,
        },
      );
    }

    const user = await User.findById(currentUser.userId)
      .select("-password")
      .lean();

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found",
        },
        {
          status: 404,
        },
      );
    }

    const { fullName: legacyFullName, ...profile } = user as typeof user & {
      fullName?: string;
    };

    return NextResponse.json(
      {
        success: true,
        user: {
          ...profile,
          name: user.name ?? legacyFullName ?? "",
        },
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    console.error("GET PROFILE ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong",
      },
      {
        status: 500,
      },
    );
  }
}

// =========================================================
// UPDATE PROFILE
// =========================================================

export async function PUT(request: NextRequest) {
  try {
    await connectDB();

    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        {
          status: 401,
        },
      );
    }

    const body = await request.json();

    const updateData: Record<string, unknown> = {};

    if (body.name !== undefined) {
      updateData.name = body.name;
    }

    if (body.phone !== undefined) {
      updateData.phone = body.phone;
    }

    if (body.image !== undefined) {
      updateData.image = body.image;
    }

    if (body.location !== undefined) {
      updateData.location = body.location;
    }

    if (body.address !== undefined) {
      updateData.address = body.address;
    }

    if (body.dateOfBirth !== undefined) {
      updateData.dateOfBirth = body.dateOfBirth;
    }

    if (body.gender !== undefined) {
      updateData.gender = body.gender;
    }

    if (body.preferences !== undefined) {
      updateData.preferences = body.preferences;
    }

    const user = await User.findByIdAndUpdate(
      currentUser.userId,
      {
        $set: updateData,
      },
      {
        new: true,
        runValidators: true,
      },
    )
      .select("-password")
      .lean();

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found",
        },
        {
          status: 404,
        },
      );
    }

    const { fullName: legacyFullName, ...profile } = user as typeof user & {
      fullName?: string;
    };

    return NextResponse.json(
      {
        success: true,
        message: "Profile updated successfully",
        user: {
          ...profile,
          name: user.name ?? legacyFullName ?? "",
        },
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    console.error("UPDATE PROFILE ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to update profile",
      },
      {
        status: 500,
      },
    );
  }
}
