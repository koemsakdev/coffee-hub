import axios from "axios";


const host = process.env.CS_HOST;
const url = "https://stageonline.wingmoney.com/vsmaster-unified-payment/api/v1/card/payment/capture-contexts";
export async function POST(req: Request) {
    try {
        const body = await req.json();

        const payload = {
            "targetOrigins": [
                "https://stageonline.wingmoney.com"
            ],
            "clientVersion": "0.19",
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
                    "phoneNumber": "011646694"
                }
            }
        };

        // const cyberResp = await axios.post(url, payload, {
        //     headers: { 'Content-Type': 'application/json' }
        // });
        // console.log("Cyber response: ", cyberResp);
        // // return Response.json({cyberResp});

        // let cyberResp = await fetch(url,
        //     {
        //         method: "POST",
        //         headers: {
        //             Host: host,
        //             "Content-Type": "application/json"
        //         },
        //         body: payload
        //     }
        // );
        // console.log(cyberResp);

        // const data = await cyberResp.json();
        // console.log(data);

        return Response.json(
            {
                status: 200,
                message: "Successfully"
            }
        );
    } catch (error: any) {
        console.log(error);
        return Response.json({ error: error.message }, { status: 400 });
    }
}