import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";

export async function GET() {
    const connected = await connectDB();

    if (!connected) {
        return NextResponse.json(
            {
                success: false,
                message: "MongoDB connection failed",
            },
            { status: 500 }
        );
    }

    return NextResponse.json({
        success: true,
        message: "MongoDB connected successfully",
    });
}