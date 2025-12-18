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
            "https://stageonline.wingmoney.com"
        ],
        "clientVersion": "0.19",
        "allowedCardNetworks": [
            "VISA",
            "MASTERCARD",
            "AMEX"
        ],
        "allowedPaymentTypes": [
            "PANENTRY"
        ],
        "country": "KH",
        "locale": "en_US",
        "buttonType": "PAY",
        "captureMandate": {
            "billingType": "NONE",
            "requestEmail": false,
            "requestPhone": false,
            "requestShipping": false,
            "shipToCountries": [
                "KH"
            ],
            "showAcceptedNetworkIcons": false,
            "showConfirmationStep": false
        },
        "orderInformation": {
            "amountDetails": {
                "totalAmount": body.amount,
                "currency": "USD"
            },
            "billTo": {
                "address1": "No 22, St Lum, Tagnov Kandal, Nirouth, Chba Ampove",
                "administrativeArea": "PP",
                "buildingNumber": "22",
                "country": "KH",
                "district": "Niroth",
                "locality": "Phnom Penh",
                "postalCode": "10172",
                "email": "neth.phan@wingbank.com.kh",
                "firstName": "Neth",
                "lastName": "Phan",
                "middleName": "M",
                "title": "Mr",
                "phoneNumber": "85577773783"
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
        // let cyberResp = await axios.post(
        //     `https://${host}/up/v1/capture-contexts`,
        //     payload,
        //     {
        //         headers: {
        //             Host: host,
        //             "v-c-merchant-id": merchantId,
        //             "v-c-date": date,
        //             Digest: digest,
        //             Signature: authorization,
        //             "Content-Type": "application/json"
        //         }
        //     }
        // );

        let cyberResp = await fetch(`https://${host}/up/v1/capture-contexts`,
            {
                method: "POST",
                headers: {
                    Host: host,
                    "v-c-merchant-id": merchantId,
                    "v-c-date": date,
                    Digest: digest,
                    Signature: authorization,
                    "Content-Type": "application/json"
                },
                body: payload
            }
        );

        if (!cyberResp.ok) {
            const err = await cyberResp.text();
            throw new Error(err);
        }

        const data = await cyberResp.text();

        return Response.json(
            {
                status: cyberResp.status,
                token: data
            }
        );
    } catch (error: any) {
        return Response.json(
            { error: error.message ?? "Internal error" },
            { status: 500 }
        );
    }
}

export async function GET() {
    return Response.json({
        code: 200,
        message: "Succcess"
    }, { status: 200 });
}