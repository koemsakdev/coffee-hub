import axios from "axios";
import crypto from "crypto";

const host = "apitest.cybersource.com";
const merchantId = process.env.CS_MERCHANT_ID!;
const keyId = process.env.CS_KEY_ID!;
const secretKey = process.env.CS_SECRET_KEY!; // base64

export async function POST(req: Request) {
    const body = await req.json();
    const payload = JSON.stringify({
        "targetOrigins": [
            "https://coffee-hub-beta.vercel.app"
        ],
        "clientVersion": "0.32",
        "buttonType": "CHECKOUT_AND_CONTINUE",
        "allowedCardNetworks": [
            "VISA",
            "MASTERCARD"
        ],
        "completeMandate": {
            "type": "CAPTURE",
            "decisionManager": false,
            "consumerAuthentication": true
        },
        "allowedPaymentTypes": [
            "CLICKTOPAY",
            "GOOGLEPAY"
        ],
        "country": "US",
        "locale": "en_US",
        "captureMandate": {
            "billingType": "FULL",
            "requestEmail": true,
            "requestPhone": true,
            "requestShipping": true,
            "shipToCountries": ["US", "GB"],
            "showAcceptedNetworkIcons": true
        },
        "orderInformation": {
            "amountDetails": {
                "totalAmount": body.amount,
                "currency": "USD"
            },
            "billTo": {
                "address1": "123 Cool Street",
                "administrativeArea": "NY",
                "buildingNumber": "12",
                "country": "US",
                "district": "district",
                "locality": "New York",
                "postalCode": "10172",
                "email": "koemsak.mean@gmail.com",
                "firstName": "Koemsak",
                "lastName": "Mean",
                "middleName": "M",
                "nameSuffix": "Jr",
                "title": "Mr",
                "phoneNumber": "1234567890",
                "phoneType": "MOBILE"
            },
            "shipTo": {
                "address1": "456 Nice Avenue",
                "administrativeArea": "CA",
                "buildingNumber": "409",
                "country": "US",
                "district": "Uptown",
                "locality": "Los Angeles",
                "postalCode": "90010",
                "firstName": "Alan",
                "lastName": "Turing"
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
        `keyid="${keyId}",` +
        `algorithm="HmacSHA256",` +
        `headers="host v-c-date request-target digest v-c-merchant-id",` +
        `signature="${signature}"`;

    try {
        let cyberResp = await axios.post(
            `https://${host}/up/v1/capture-contexts`,
            payload,
            {
                headers: {
                    Host: host,
                    "v-c-merchant-id": merchantId,
                    "v-c-date": date,
                    Digest: digest,
                    Signature: authorization,
                    "Content-Type": "application/json"
                }
            }
        );
        return Response.json(
            {
                status: cyberResp.status,
                token: cyberResp.data
            }
        );
    } catch (error: any) {
        return Response.json(
            { error: error.message ?? "Internal error" },
            { status: 500 }
        );
    }
}