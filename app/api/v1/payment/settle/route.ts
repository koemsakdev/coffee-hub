/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
const url = process.env.SERVER_API_URL!;
export async function POST(req: Request) {
    const body = await req.json();

    const payload = JSON.stringify({
        "clientReferenceInformation": { "code": body.client_reference },
        "orderInformation": {
            "amountDetails": { "totalAmount": parseFloat(body.amount).toFixed(2), "currency": body.currency }
        }
    });

    console.log("Payload for Settlement:", payload);
    try {
        const cyberResp = await axios.post(
            `${url}/api/v1/card/payment/payment-capture?paymentId=${body.transaction_id}`,
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
            data: cyberResp.data
        });
    } catch (error: any) {
        return Response.json(
            { error: error.message ?? "Internal error" },
            { status: 500 }
        );
    }
}