import crypto from "crypto";

const merchantId = process.env.CS_MERCHANT_ID!;
const keyId = process.env.CS_KEY_ID!;
const secretKey = process.env.CS_SECRET_KEY!;
const host = "apitest.cybersource.com";

export async function POST(req: Request) {
    console.log(merchantId, keyId, secretKey)
    try {
        const body = await req.json();
        const payload = JSON.stringify({
            clientReferenceInformation: { code: body.orderNo },
            processingInformation: { capture: true },
            orderInformation: {
                amountDetails: {
                    totalAmount: body.amount,
                    currency: body.currency
                },
                billTo: {
                    firstName: "John",
                    lastName: "Doe",
                    address1: "1 Market St",
                    locality: "san francisco",
                    administrativeArea: "CA",
                    postalCode: "94105",
                    country: "US",
                    email: "test@cybs.com",
                    phoneNumber: "4158880000"
                }
            },
            paymentInformation: {
                card: {
                    number: "4111111111111111",
                    expirationMonth: "12",
                    expirationYear: "2031",
                    securityCode: "123"
                }
            }
        });

        const date = new Date().toUTCString();
        const digest = `SHA-256=${crypto
            .createHash("sha256")
            .update(payload)
            .digest("base64")}`;

        const signatureString =
            `host: ${host}\n` +
            `date: ${date}\n` +
            `request-target: post /pts/v2/payments\n` +
            `digest: ${digest}\n` +
            `v-c-merchant-id: ${merchantId}`;

        const signature = crypto
            .createHmac("sha256", Buffer.from(secretKey, "base64"))
            .update(signatureString)
            .digest("base64");

        const authHeader =
            `Signature keyid="${keyId}",` +
            `algorithm="HmacSHA256",` +
            `headers="host date request-target digest v-c-merchant-id",` +
            `signature="${signature}"`;

        const csRes = await fetch(`https://${host}/pts/v2/payments`, {
            method: "POST",
            headers: {
                host: host,
                "Content-Type": "application/json",
                "v-c-merchant-id": merchantId,
                Date: date,
                Digest: digest,
                Authorization: authHeader
            },
            body: payload
        });
        const rawText = await csRes.text();
        console.log("CYBERSOURCE STATUS:", csRes.status);
        console.log("CYBERSOURCE RAW RESPONSE:", rawText);

        return new Response(rawText, {
            status: csRes.status,
            headers: { "Content-Type": "application/json" }
        });
    } catch (err: any) {
        console.error("PAY API ERROR:", err);

        return Response.json(
            { error: err.message ?? "Internal error" },
            { status: 500 }
        );
    }
}
