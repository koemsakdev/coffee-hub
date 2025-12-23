"use client";

import { Separator } from "@/components/ui/separator";
import { decodeJWT } from "@/utils";
import { ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";

const UnifiedCheckoutPage = () => {
    const [payload, setPayload] = useState();
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const stored = localStorage.getItem("payload");
        if (stored) {
            setPayload(JSON.parse(stored));
        }
    }, []);

    useEffect(() => {
        const setUpUnifiedCheckout = async () => {
            try {
                setLoading(true);
                const resp = await fetch("/api/v1/payment/checkout", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: payload
                });

                if (!resp.ok) {
                    const errorText = await resp.text();
                    throw new Error(`Request failed: ${resp.status} - ${errorText}`);
                }

                const data = await resp.json();

                if (data.status == 200) {
                    const token = data.token;

                    const libraryUrl = data.client_library;
                    const integrity = data.integrity;

                    const head = window.document.getElementsByTagName("head")[0];
                    const script = window.document.createElement("script");
                    script.type = "text/javascript";
                    script.async = true;

                    script.onload = async function () {
                        console.log("JS Is Loaded");
                        try {
                            // @ts-expect-error
                            const accept = await window.Accept(token);
                            const up = await accept.unifiedPayments(false);

                            const trigger = up.createTrigger("PANENTRY", {
                                containers: {
                                    paymentScreen: "#paymentScreenContainer",
                                },
                            });

                            let checkoutObserver: MutationObserver | null = null;

                            try {
                                const container = document.querySelector(
                                    "#paymentScreenContainer"
                                ) as HTMLElement | null;

                                if (!container) {
                                    console.error("paymentScreenContainer not found");
                                    return;
                                }

                                checkoutObserver = new MutationObserver(() => {
                                    const iframe = container.querySelector("iframe");

                                    // iframe removed BEFORE complete() → user clicked back
                                    if (!iframe) {
                                        console.log("Unified Checkout back clicked");
                                        checkoutObserver?.disconnect();
                                    }
                                });

                                checkoutObserver.observe(container, {
                                    childList: true,
                                    subtree: true,
                                });

                                const tt = await trigger.show();
                                console.log("Transient Token:", tt);

                                if (!tt) {
                                    checkoutObserver.disconnect();
                                    return;
                                }

                                // 🔑 Stop observing BEFORE complete
                                checkoutObserver.disconnect();

                                const completeResponse = await up.complete(tt);
                                console.log("Complete response:", completeResponse);

                            } catch (err) {
                                console.error("Payment error:", err);
                                checkoutObserver?.disconnect();
                            }




                            // const tt = await up.show(showArgs);
                            // const completeResponse = await up.complete(tt);
                            // console.log("complete response: ", completeResponse);
                            // const paymentResponse = decodeJWT(completeResponse);
                            // console.log("Payment response: ", paymentResponse);
                        } catch (err: any) {
                            console.log(err);
                        } finally {
                            setLoading(false);
                        }
                    };

                    script.src = libraryUrl;
                    if (integrity) {
                        script.integrity = integrity;
                        script.crossOrigin = "anonymous";
                    }
                    head.appendChild(script);
                }
            } catch (error) {
                console.log(error);
                setLoading(false);
            }
        };
        // setUpUnifiedCheckout();
    }, []);

    return (
        <div className="flex flex-col min-h-screen">
            <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 font-sans selection:bg-blue-100">
                <div className="max-w-5xl mx-auto">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-12">
                        <div className="flex items-center gap-2">
                            <div className="bg-blue-600 p-2 rounded-lg">
                                <ShieldCheck className="w-6 h-6 text-white" />
                            </div>
                            <div className="flex flex-col gap-1">
                                <h1 className="text-xl font-bold text-slate-900 leading-none">CyberSource</h1>
                                <p className="text-xs text-slate-500 font-medium tracking-widest uppercase">Unified Checkout</p>
                            </div>
                        </div>
                    </div>

                    <Separator className="mb-10" />

                    <div className="p-4 shadow rounded-sm w-full max-w-xl mx-auto">
                        {loading && (
                            <div className="h-70 flex items-center justify-center">
                                <p>Loading</p>
                            </div>
                        )}
                        <div id="paymentScreenContainer"></div>
                    </div>

                    {/* Footer */}
                    <footer className="mt-16 pt-8 border-t border-slate-200 text-center space-y-4">
                        <div className="flex justify-center items-center gap-8 opacity-40">
                            <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-6" />
                            <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-6" />
                        </div>
                        <p className="text-xs text-slate-400">
                            &copy; 2025 Payment Gateway Simulation. Powered by CyberSource Solutions.
                            All transactions are protected by tokenization technology.
                        </p>
                    </footer>
                </div>
            </div>
        </div>
    )
}

export default UnifiedCheckoutPage;
