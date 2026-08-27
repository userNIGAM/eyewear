import { NextRequest, NextResponse } from "next/server";

import {
  checkEsewaTransactionStatus,
  ESEWA_DEFAULT_PRODUCT_CODE,
  ESEWA_DEFAULT_SECRET_KEY,
  verifyEsewaResponseSignature,
} from "@/lib/esewa";

function decodeEsewaResponse(encodedResponse: string) {
  const decoded = Buffer.from(encodedResponse, "base64").toString("utf-8");

  return JSON.parse(decoded) as Record<string, string>;
}

export async function GET(request: NextRequest) {
  try {
    const encodedData = request.nextUrl.searchParams.get("data");

    if (!encodedData) {
      return NextResponse.redirect(
        new URL("/payment/failure?reason=missing_response", request.url),
      );
    }

    const responseData = decodeEsewaResponse(encodedData);

    const secretKey = process.env.ESEWA_SECRET_KEY || ESEWA_DEFAULT_SECRET_KEY;

    const productCode =
      process.env.ESEWA_PRODUCT_CODE || ESEWA_DEFAULT_PRODUCT_CODE;

    /*
     * First verify eSewa's response signature.
     */
    const signatureValid = verifyEsewaResponseSignature(
      responseData,
      secretKey,
    );

    if (!signatureValid) {
      console.error("Invalid eSewa response signature.");

      return NextResponse.redirect(
        new URL("/payment/failure?reason=invalid_signature", request.url),
      );
    }

    const transactionUuid = responseData.transaction_uuid;

    const totalAmount = String(responseData.total_amount);

    if (!transactionUuid || !totalAmount) {
      return NextResponse.redirect(
        new URL("/payment/failure?reason=invalid_response", request.url),
      );
    }

    /*
     * Ask eSewa for the actual transaction status.
     */
    const status = await checkEsewaTransactionStatus(
      transactionUuid,
      totalAmount,
      productCode,
    );

    console.log("eSewa verification response:", status);

    if (status.status !== "COMPLETE") {
      return NextResponse.redirect(
        new URL(
          `/payment/failure?reason=${encodeURIComponent(
            status.status || "payment_not_complete",
          )}`,
          request.url,
        ),
      );
    }

    /*
     * IMPORTANT:
     *
     * This is where you should update your database:
     *
     * paymentStatus = "PAID"
     * orderStatus = "CONFIRMED"
     *
     * using transactionUuid to find the order.
     */

    const successUrl = new URL("/payment/success", request.url);

    successUrl.searchParams.set("transaction_uuid", transactionUuid);

    successUrl.searchParams.set("status", "COMPLETE");

    return NextResponse.redirect(successUrl);
  } catch (error) {
    console.error("eSewa success verification error:", error);

    return NextResponse.redirect(
      new URL("/payment/failure?reason=verification_error", request.url),
    );
  }
}
