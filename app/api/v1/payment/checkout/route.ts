import axios from "axios";
const url = process.env.SERVER_API_URL!;
export async function POST(req: Request) {
    const body = await req.json();
    const payload = JSON.stringify(
        {
            "targetOrigins": [
                "https://localhost:3000"
            ],
            "clientVersion": "0.32",
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
            "captureMandate": {
                "billingType": "NONE",
                "requestEmail": false,
                "requestPhone": false,
                "requestShipping": false,
                "shipToCountries": [
                    "KH"
                ],
                "showAcceptedNetworkIcons": true
            },
            "completeMandate": {
                "type": "AUTH",
                "decisionManager": true,
                "consumerAuthentication": true
            },
            "orderInformation": {
                "amountDetails": {
                    "totalAmount": `${body.amount}`,
                    "currency": "USD"
                },
                "billTo": {
                    "address1": body.address || "No 22, St Lum, Tagnov Kandal, Nirouth, Chba Ampove",
                    "administrativeArea": "KH-12",
                    "buildingNumber": "22",
                    "country": "KH",
                    "district": "Niroth",
                    "locality": "Phnom Penh",
                    "postalCode": "10172",
                    "email": body.email || "neth.phan@gmail.com",
                    "firstName": body.firstName || "Neth",
                    "lastName": body.lastName || "Phan",
                    "middleName": "M",
                    "title": "Mr",
                    "phoneNumber": "85577773783"
                }
            }
        }
    );

    try {
        const cyberResp = await axios.post(
            url,
            payload,
            {
                headers: {
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
            ctx: cyberResp.data.ctx,
            token: cyberResp.data.token,
            client_library: cyberResp.data.clientLibrary,
            integrity: cyberResp.data.clientLibraryIntegrity
        });
    } catch (error: any) {
        return Response.json(
            { error: error.message ?? "Internal error" },
            { status: 500 }
        );
    }
}