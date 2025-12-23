/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
const url = process.env.SERVER_API_URL!;
export async function POST(req: Request) {
    const body = await req.json();
    try {
        const cyberResp = await axios.post(
            url,
            body,
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