import axios from "axios";


const host = process.env.CS_HOST;
export async function POST(req: Request) {
    const url = 'https://stageonline.wingmoney.com/vsmaster-unified-payment/api/v1/card/payment/capture-contexts';
    try {
        const body = await req.json();

        console.log(body.amount)

        const payload = {
            "targetOrigins": [
                "https://localhost:3000"
            ],
            "clientVersion": "0.32",
            "allowedCardNetworks": [
                "VISA",
                "MASTERCARD",
                "AMEX",
                "DISCOVER",
                "JCB",
                "DINERSCLUB"
            ],
            "allowedPaymentTypes": [
                "PANENTRY"
            ],
            "country": "US",
            "locale": "en_US",
            "captureMandate": {
                "billingType": "FULL",
                "requestEmail": true,
                "requestPhone": true,
                "shipToCountries": [
                    "US",
                    "GB"
                ],
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
                    "phoneNumber": "011646694",
                    "phoneType": "MOBILE"
                }
            }
        };


        const cyberResp = await axios.post(url, JSON.stringify(payload), { // payload is a JS Object
            headers: { 'Content-Type': 'application/json' }
        });
        console.log("Cyber response: ", cyberResp);
        // return Response.json({cyberResp});
        return Response.json({ status: 200, message: "Success" });
    } catch (error: any) {
        return Response.json({ error: error.message }, { status: 400 });
    }
}