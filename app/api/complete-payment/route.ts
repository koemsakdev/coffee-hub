/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/complete-payment/route.ts
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    const { authenticationTransactionId, transientToken } = await req.json();

    const host = process.env.CYBERSOURCE_HOST!;
    const merchantId = process.env.CYBERSOURCE_MERCHANT_ID!;
    const apiKey = process.env.CYBERSOURCE_API_KEY!;
    const sharedSecret = process.env.CYBERSOURCE_SHARED_SECRET!;

    // Create authorization payload
    const payload = {
      clientReferenceInformation: {
        code: `ORDER-${Date.now()}`,
      },
      paymentInformation: {
        customer: {
          customerId: transientToken,
        },
      },
      consumerAuthenticationInformation: {
        authenticationTransactionId: authenticationTransactionId,
      },
    };

    const resource = "/pts/v2/payments";
    const payloadString = JSON.stringify(payload);

    // Generate signature
    const digest = `SHA-256=${crypto
      .createHash("sha256")
      .update(payloadString, "utf8")
      .digest("base64")}`;

    const date = new Date().toUTCString();

    const signatureString = [
      `host: ${host}`,
      `date: ${date}`,
      `(request-target): post ${resource}`,
      `digest: ${digest}`,
      `v-c-merchant-id: ${merchantId}`,
    ].join("\n");

    const signatureHash = crypto
      .createHmac("sha256", sharedSecret)
      .update(signatureString, "utf8")
      .digest("base64");

    const authorization = `keyid="${apiKey}", algorithm="HmacSHA256", headers="host date (request-target) digest v-c-merchant-id", signature="${signatureHash}"`;

    // Make payment request
    const response = await fetch(`https://${host}${resource}`, {
      method: "POST",
      headers: {
        "v-c-merchant-id": merchantId,
        "v-c-date": date,
        "Digest": digest,
        "Signature": authorization,
        "Content-Type": "application/json",
      },
      body: payloadString,
    });

    const data = await response.json();

    if (data.status === "AUTHORIZED") {
      return NextResponse.json({
        success: true,
        transactionId: data.id,
      });
    } else {
      return NextResponse.json({
        success: false,
        message: data.message || "Payment authorization failed",
      });
    }
  } catch (error: any) {
    console.error("Payment completion error:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}