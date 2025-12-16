import crypto from "crypto";

const host = "apitest.cybersource.com";
const merchantId = process.env.CS_MERCHANT_ID!;
const keyId = process.env.CS_KEY_ID!;
const secretKey = process.env.CS_SECRET_KEY!; // base64

export async function POST() {
    const payload = JSON.stringify({
        targetOrigins: ["https://test.com", "http://localhost:3000"],
        clientVersion: "0.31",
        buttonType: "CHECKOUT_AND_CONTINUE",

        allowedCardNetworks: ["VISA", "MASTERCARD"],
        allowedPaymentTypes: [
            "PANENTRY",
            "CLICKTOPAY",
            "APPLEPAY",
            "GOOGLEPAY"
        ],

        completeMandate: {
            type: "CAPTURE",
            decisionManager: true,
            consumerAuthentication: true,
            tms: {
                tokenCreate: true,
                tokenTypes: [
                    "customer",
                    "paymentInstrument",
                    "instrumentIdentifier",
                    "shippingAddress"
                ]
            }
        },

        country: "US",
        locale: "en_US",

        captureMandate: {
            billingType: "FULL",
            requestEmail: true,
            requestPhone: true,
            requestShipping: true,
            shipToCountries: ["US", "GB"],
            showAcceptedNetworkIcons: true
        },

        data: {
            orderInformation: {
                billTo: {
                    country: "US",
                    firstName: "NEW",
                    lastName: "Test",
                    phoneNumber: "1234567890",
                    address1: "901 Metro Center Blvd",
                    address2: "Desk M3-5573",
                    buildingNumber: "150",
                    postalCode: "94404",
                    locality: "Foster City",
                    administrativeArea: "CA",
                    email: "test@example.com"
                },
                shipTo: {
                    country: "US",
                    firstName: "NEW",
                    lastName: "Test",
                    address1: "901 Metro Center Blvd",
                    address2: "Desk M3-5573",
                    buildingNumber: "150",
                    postalCode: "94404",
                    locality: "Foster City",
                    administrativeArea: "CA"
                },
                amountDetails: {
                    totalAmount: "13.00",
                    currency: "USD"
                }
            },
            clientReferenceInformation: {
                code: "TAGX001"
            }
        }
    });

    // ---- Signature ----
    const date = new Date().toUTCString();
    const digest =
        "SHA-256=" +
        crypto.createHash("sha256").update(payload).digest("base64");

    const signatureString =
        `host: ${host}\n` +
        `v-c-date: ${date}\n` +
        `request-target: post /up/v1/capture-contexts\n` +
        `digest: ${digest}\n` +
        `v-c-merchant-id: ${merchantId}`;

    const signature = crypto
        .createHmac("sha256", Buffer.from(secretKey, "base64"))
        .update(signatureString)
        .digest("base64");

    const authorization =
        `Signature keyid="${keyId}",` +
        `algorithm="HmacSHA256",` +
        `headers="host v-c-date request-target digest v-c-merchant-id",` +
        `signature="${signature}"`;

    const res = await fetch(`https://${host}/up/v1/capture-contexts`, {
        method: "POST",
        headers: {
            host,
            Accept: "application/json",
            "Content-Type": "application/json",
            "v-c-merchant-id": merchantId,
            "v-c-date": date,
            Digest: digest,
            Authorization: authorization
        },
        body: payload
    });

    const data = await res.json();
    return Response.json(data);
}
