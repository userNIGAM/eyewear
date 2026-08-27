import crypto from "crypto";

export const ESEWA_SANDBOX_FORM_URL =
  "https://rc-epay.esewa.com.np/api/epay/main/v2/form";

export const ESEWA_DEFAULT_PRODUCT_CODE = "EPAYTEST";
export const ESEWA_DEFAULT_SECRET_KEY = "8gBm/:&EnhH.1/q";

export interface EsewaPaymentRequest {
  amount: number;
  taxAmount: number;
  serviceCharge: number;
  deliveryCharge: number;
}

export interface EsewaPaymentPayload {
  actionUrl: string;
  fields: Record<string, string>;
}

export function formatEsewaAmount(value: number): string {
  const normalized = Number(value.toFixed(2));

  return Number.isInteger(normalized)
    ? String(normalized)
    : normalized.toString();
}

export function createEsewaSignature(params: {
  totalAmount: string;
  transactionUuid: string;
  productCode: string;
  secretKey?: string;
}): string {
  const { totalAmount, transactionUuid, productCode, secretKey } = params;
  const message = `total_amount=${totalAmount},transaction_uuid=${transactionUuid},product_code=${productCode}`;
  const key = secretKey || ESEWA_DEFAULT_SECRET_KEY;

  return crypto
    .createHmac("sha256", key)
    .update(message)
    .digest("base64");
}

export function buildEsewaPaymentPayload(
  request: EsewaPaymentRequest,
  origin: string,
  options?: {
    productCode?: string;
    secretKey?: string;
  },
): EsewaPaymentPayload {
  const productCode =
    options?.productCode || ESEWA_DEFAULT_PRODUCT_CODE;

  const totalAmount =
    request.amount +
    request.taxAmount +
    request.serviceCharge +
    request.deliveryCharge;

  const transactionUuid = crypto.randomUUID();

  const formattedTotalAmount = formatEsewaAmount(totalAmount);
  const formattedAmount = formatEsewaAmount(request.amount);
  const formattedTaxAmount = formatEsewaAmount(request.taxAmount);
  const formattedServiceCharge = formatEsewaAmount(request.serviceCharge);
  const formattedDeliveryCharge = formatEsewaAmount(request.deliveryCharge);
  const signature = createEsewaSignature({
    totalAmount: formattedTotalAmount,
    transactionUuid,
    productCode,
    secretKey: options?.secretKey,
  });

  return {
    actionUrl: ESEWA_SANDBOX_FORM_URL,
    fields: {
      amount: formattedAmount,
      tax_amount: formattedTaxAmount,
      total_amount: formattedTotalAmount,
      transaction_uuid: transactionUuid,
      product_code: productCode,
      product_service_charge: formattedServiceCharge,
      product_delivery_charge: formattedDeliveryCharge,
      success_url: `${origin}/payment/success`,
      failure_url: `${origin}/payment/failure`,
      signed_field_names: "total_amount,transaction_uuid,product_code",
      signature,
    },
  };
}
