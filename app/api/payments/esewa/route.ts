import { NextRequest, NextResponse } from "next/server";

import {
  buildEsewaPaymentPayload,
  ESEWA_DEFAULT_PRODUCT_CODE,
  ESEWA_DEFAULT_SECRET_KEY,
} from "@/lib/esewa";

interface EsewaCheckoutRequest {
  amount: number;
  taxAmount: number;
  serviceCharge: number;
  deliveryCharge: number;
}

function getRequestOrigin(request: NextRequest) {
  const origin = request.headers.get("origin");

  if (origin) {
    return origin;
  }

  return new URL(request.url).origin;
}

export async function POST(request: NextRequest) {
  try {
    const body: EsewaCheckoutRequest = await request.json();

    const amount = Number(body.amount);
    const taxAmount = Number(body.taxAmount);
    const serviceCharge = Number(body.serviceCharge);
    const deliveryCharge = Number(body.deliveryCharge);

    if (
      Number.isNaN(amount) ||
      Number.isNaN(taxAmount) ||
      Number.isNaN(serviceCharge) ||
      Number.isNaN(deliveryCharge)
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid payment request",
        },
        { status: 400 },
      );
    }

    const payload = buildEsewaPaymentPayload(
      {
        amount,
        taxAmount,
        serviceCharge,
        deliveryCharge,
      },
      getRequestOrigin(request),
      {
        productCode:
          process.env.ESEWA_PRODUCT_CODE || ESEWA_DEFAULT_PRODUCT_CODE,
        secretKey:
          process.env.ESEWA_SECRET_KEY || ESEWA_DEFAULT_SECRET_KEY,
      },
    );

    return NextResponse.json(
      {
        success: true,
        ...payload,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("eSewa initialization error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to initialize eSewa payment",
      },
      { status: 500 },
    );
  }
}
