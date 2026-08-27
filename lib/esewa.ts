import crypto from "crypto";

export const ESEWA_DEFAULT_PRODUCT_CODE = "EPAYTEST";
export const ESEWA_DEFAULT_SECRET_KEY = "8gBm/:&EnhH.1/q";

export const ESEWA_PAYMENT_URL =
  "https://rc-epay.esewa.com.np/api/epay/main/v2/form";

export const ESEWA_STATUS_URL =
  "https://rc.esewa.com.np/api/epay/transaction/status/";

interface EsewaConfig {
  productCode: string;
  secretKey: string;
}

interface EsewaPaymentInput {
  amount: number;
  taxAmount: number;
  serviceCharge: number;
  deliveryCharge: number;
}

function formatAmount(amount: number) {
  return amount.toFixed(2);
}

function generateTransactionUuid() {
  const timestamp = Date.now();

  const random = crypto.randomBytes(6).toString("hex");

  return `ORDER-${timestamp}-${random}`;
}

function generateSignature(
  totalAmount: string,
  transactionUuid: string,
  productCode: string,
  secretKey: string,
) {
  const message =
    `total_amount=${totalAmount},` +
    `transaction_uuid=${transactionUuid},` +
    `product_code=${productCode}`;

  return crypto
    .createHmac("sha256", secretKey)
    .update(message)
    .digest("base64");
}

export function buildEsewaPaymentPayload(
  payment: EsewaPaymentInput,
  origin: string,
  config: EsewaConfig,
) {
  const amount = formatAmount(payment.amount);
  const taxAmount = formatAmount(payment.taxAmount);
  const serviceCharge = formatAmount(payment.serviceCharge);
  const deliveryCharge = formatAmount(payment.deliveryCharge);

  const totalAmount = formatAmount(
    payment.amount +
      payment.taxAmount +
      payment.serviceCharge +
      payment.deliveryCharge,
  );

  const transactionUuid = generateTransactionUuid();

  const signedFieldNames = "total_amount,transaction_uuid,product_code";

  const signature = generateSignature(
    totalAmount,
    transactionUuid,
    config.productCode,
    config.secretKey,
  );

  const successUrl = `${origin}/api/payments/esewa/success`;

  const failureUrl = `${origin}/payment/failure`;

  return {
    actionUrl: ESEWA_PAYMENT_URL,

    transactionUuid,

    fields: {
      amount,
      tax_amount: taxAmount,
      total_amount: totalAmount,

      transaction_uuid: transactionUuid,

      product_code: config.productCode,

      product_service_charge: serviceCharge,
      product_delivery_charge: deliveryCharge,

      success_url: successUrl,
      failure_url: failureUrl,

      signed_field_names: signedFieldNames,
      signature,
    },
  };
}

export function verifyEsewaResponseSignature(
  response: Record<string, string>,
  secretKey: string,
) {
  const signedFieldNames = response.signed_field_names;

  if (!signedFieldNames) {
    return false;
  }

  const fields = signedFieldNames
    .split(",")
    .map((field) => field.trim())
    .filter(Boolean);

  const message = fields
    .map((field) => {
      return `${field}=${response[field] ?? ""}`;
    })
    .join(",");

  const expectedSignature = crypto
    .createHmac("sha256", secretKey)
    .update(message)
    .digest("base64");

  const receivedSignature = response.signature;

  if (!receivedSignature) {
    return false;
  }

  return crypto.timingSafeEqual(
    Buffer.from(expectedSignature),
    Buffer.from(receivedSignature),
  );
}

export async function checkEsewaTransactionStatus(
  transactionUuid: string,
  totalAmount: string,
  productCode: string,
) {
  const params = new URLSearchParams({
    product_code: productCode,
    total_amount: totalAmount,
    transaction_uuid: transactionUuid,
  });

  const response = await fetch(`${ESEWA_STATUS_URL}?${params.toString()}`, {
    method: "GET",
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`eSewa status check failed: ${response.status}`);
  }

  return response.json();
}
