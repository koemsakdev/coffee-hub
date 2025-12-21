/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/process-payment/route.ts
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    const { transientToken, amount, currency } = await req.json();

    const host = process.env.CYBERSOURCE_HOST!; // apitest.cybersource.com or api.cybersource.com
    const merchantId = process.env.CYBERSOURCE_MERCHANT_ID!;
    const apiKey = process.env.CYBERSOURCE_API_KEY!;
    const sharedSecret = process.env.CYBERSOURCE_SHARED_SECRET!;

    // Create payment payload
    const payload = {
      clientReferenceInformation: {
        code: `ORDER-${Date.now()}`, // Unique order reference
      },
      paymentInformation: {
        customer: {
          customerId: transientToken, // The transient token from frontend
        },
      },
      orderInformation: {
        amountDetails: {
          totalAmount: amount,
          currency: currency,
        },
        billTo: {
          firstName: "John",
          lastName: "Doe",
          email: "john.doe@example.com",
          // Add more billing info as needed
        },
      },
      consumerAuthenticationInformation: {
        returnUrl: `${process.env.NEXT_PUBLIC_APP_URL}/api/3ds-callback`, // For 3DS redirect
      },
    };

    const resource = "/risk/v1/authentication-setups";
    const payloadString = JSON.stringify(payload);

    // Generate signature (similar to capture-context)
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

    // Make request to CyberSource
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

    // Check if 3DS is required
    if (data.status === "PENDING_AUTHENTICATION") {
      return NextResponse.json({
        requires3DS: true,
        authenticationTransactionId: data.id,
        accessToken: data.consumerAuthenticationInformation?.accessToken,
        stepUpUrl: data.consumerAuthenticationInformation?.stepUpUrl,
      });
    } else if (data.status === "AUTHORIZED") {
      return NextResponse.json({
        success: true,
        transactionId: data.id,
      });
    } else {
      return NextResponse.json({
        success: false,
        message: data.message || "Payment failed",
      });
    }
  } catch (error: any) {
    console.error("Payment processing error:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}