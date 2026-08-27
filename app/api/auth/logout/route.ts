import { NextResponse } from "next/server";
import { clearAuthCookie } from "@/lib/auth-utils";

export async function POST() {
  try {
    const response = NextResponse.json(
      {
        success: true,
        message: "Logout successful",
      },
      { status: 200 }
    );

    clearAuthCookie(response);

    return response;
  } catch (error) {
    console.error("Logout error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to logout",
      },
      { status: 500 }
    );
  }
}