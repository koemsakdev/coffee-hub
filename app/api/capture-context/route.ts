/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import crypto from "crypto";

const host = "apitest.cybersource.com";
const requestPath = "/up/v1/capture-contexts";
const merchantId = process.env.CS_MERCHANT_ID!;
const keyId = process.env.CS_KEY_ID!;
const secretKey = process.env.CS_SECRET_KEY!; // base64

export async function POST(req: Request) {
  const body = await req.json();
  const payload = JSON.stringify({
    targetOrigins: ["https://localhost:3000", "https://coffee-hub-beta.vercel.app"],
    clientVersion: "0.32",
    allowedCardNetworks: ["VISA", "MASTERCARD", "AMEX"],
    allowedPaymentTypes: ["PANENTRY"],
    country: "KH",
    locale: "en_US",
    buttonType: "PAY",
    captureMandate: {
      billingType: "NONE",
      requestEmail: false,
      requestPhone: false,
      requestShipping: false,
      shipToCountries: ["KH"],
      showAcceptedNetworkIcons: false,
      showConfirmationStep: false,
    },
    completeMandate: {
      type: "PREFER_AUTH",
      decisionManager: false,
      consumerAuthentication: true,
    },
    orderInformation: {
      amountDetails: {
        totalAmount: body.amount,
        currency: "USD",
      },
      billTo: {
        email: body.email || "W2iVz@example.com",
        firstName: body.firstName || "John",
        lastName: body.lastName || "Doe",
        address1: body.address || "1 Market St",
      },
    },
  });

  // Log the payload where the request come from
  console.log("Request origin:", req.headers.get("origin"));


  // ---- Signature ----
  const date = new Date().toUTCString();
  const digest =
    "SHA-256=" + crypto.createHash("sha256").update(payload).digest("base64");

  const signatureString =
    `host: ${host}\n` +
    `v-c-date: ${date}\n` +
    `request-target: post ${requestPath}\n` +
    `digest: ${digest}\n` +
    `v-c-merchant-id: ${merchantId}`;

  const signature = crypto
    .createHmac("sha256", Buffer.from(secretKey, "base64"))
    .update(signatureString)
    .digest("base64");

  const authorization =
    `keyid="${keyId}",` +
    `algorithm="HmacSHA256",` +
    `headers="host v-c-date request-target digest v-c-merchant-id",` +
    `signature="${signature}"`;

  try {
    const cyberResp = await axios.post(
      `https://${host}/up/v1/capture-contexts`,
      payload,
      {
        headers: {
          "v-c-merchant-id": merchantId,
          "v-c-date": date,
          Digest: digest,
          Signature: authorization,
          "Content-Type": "application/json",
        },
        transformRequest: [
          (data: any) => {
            return typeof data === "string" ? data : JSON.stringify(data);
          },
        ],
      }
    );

    return Response.json({
      status: cyberResp.status,
      token: cyberResp.data,
    });
  } catch (error: any) {
    return Response.json(
      { error: error.message ?? "Internal error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  return Response.json(
    {
      code: 200,
      message: "Succcess",
    },
    { status: 200 }
  );
}
