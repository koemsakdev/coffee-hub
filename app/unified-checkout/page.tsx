"use client";

import { Separator } from "@/components/ui/separator";
import { decodeJWT } from "@/utils";
import { ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Spinner } from "@/components/ui/spinner";
import { useCartStore } from "@/stores/cartStore";

const UnifiedCheckoutPage = () => {
  const router = useRouter();
  const [payload, setPayload] = useState(null);
  const clearCard = useCartStore((state) => state.clearCart);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = localStorage.getItem("payload");
    if (stored) {
      console.log(typeof JSON.parse(stored));
      setPayload(JSON.parse(stored));
    } else {
      router.push("/");
    }
  }, [router]);

  useEffect(() => {
    const setUpUnifiedCheckout = async () => {
      if (!payload) return;

      let checkoutObserver: MutationObserver | null = null;
      let tokenReceived = false;
      let isCompleting = false;

      try {
        const resp = await fetch("/api/v1/payment/checkout", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        if (!resp.ok) {
          throw new Error(await resp.text());
        }

        const data = await resp.json();
        if (data.status !== 200) return;

        const { token, client_library, integrity } = data;

        // ---- Load Accept.js ----
        const script = document.createElement("script");
        script.src = client_library;
        script.async = true;
        if (integrity) {
          script.integrity = integrity;
          script.crossOrigin = "anonymous";
        }

        script.onload = async () => {
          try {
            // @ts-expect-error CyberSource global
            const accept = await window.Accept(token);
            const up = await accept.unifiedPayments(false);

            const trigger = up.createTrigger("PANENTRY", {
              containers: {
                paymentScreen: "#paymentScreenContainer",
              },
            });

            const container = document.querySelector(
              "#paymentScreenContainer"
            ) as HTMLElement | null;

            if (!container) {
              console.error("paymentScreenContainer not found");
              return;
            }

            // ---- Observe iframe disappearance ----
            checkoutObserver = new MutationObserver(() => {
              const iframe = container.querySelector("iframe");

              // iframe removed BEFORE token → user cancelled
              if (!iframe && !tokenReceived && !isCompleting) {
                checkoutObserver?.disconnect();
                router.replace("/");
              }
            });

            checkoutObserver.observe(container, {
              childList: true,
              subtree: true,
            });

            // ---- Show Unified Checkout ----
            const tt = await trigger.show();

            if (!tt) {
              checkoutObserver.disconnect();
              router.replace("/");
              return;
            }

            tokenReceived = true;
            isCompleting = true;
            checkoutObserver.disconnect();

            // ---- Complete payment (ONLY ONCE) ----
            const completeResponse = await up.complete(tt);
            const paymentResponse = decodeJWT(completeResponse);

            localStorage.removeItem("payload");
            localStorage.removeItem("capture-context");
            clearCard();

            if (paymentResponse.status === "AUTHORIZED") {
              router.replace(`/success?token=${completeResponse}`);
            } else {
              router.replace(`/fails?token=${completeResponse}`);
            }
          } catch (err: any) {
            console.error("Payment error:", err);
            alert(err.message)
            checkoutObserver?.disconnect();
            router.replace("/");
          }
        };

        document.head.appendChild(script);
      } catch (err) {
        console.error(err);
      }
    };

    setUpUnifiedCheckout();
  }, [clearCard, payload, router]);

  return (
    <div className="flex flex-col min-h-screen" id="checkoutPage">
      <div className="min-h-screen bg-linear-to-r backdrop-blur-sm from-[#000000]/50 via-[#000000]/50 to-blue-500/80 py-12 px-4 sm:px-6 lg:px-8 font-sans selection:bg-lime-500 selection:text-lime-200">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex flex-col items-start gap-2">
              <Image
                src={'/wb-logo.svg'}
                width={200}
                height={200}
                alt="Wing Bank Logo"
                className="object-contain h-10 w-auto"
              />
              <div className="flex flex-col gap-1">
                {/* <h1 className="text-xl text-blue-500 text-shadow-blue-500 font-bold leading-none">
                  Wing Bank Cambodia Plc
                </h1> */}
                <p className="text-xs text-white font-medium tracking-widest uppercase">
                  Payment Gateway Simulation
                </p>
              </div>
            </div>
          </div>

          <Separator className="mb-10" />

          <div className="w-full max-w-xl mx-auto">
            <div
              id="paymentScreenContainer"
              className="min-h-70 flex items-center justify-center rounded-2xl"
            >
              <Spinner className="w-12 h-12 text-blue-600" />
            </div>
          </div>

          {/* Footer */}
          <footer className="mt-16 pt-8 border-t border-slate-200 text-center space-y-4">
            <div className="flex justify-center items-center gap-8">
              <Image
                src={
                  "https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg"
                }
                alt="Visa"
                className="h-6"
                width={42}
                height={42}
              />
              <Image
                src={
                  "https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg"
                }
                alt="Mastercard"
                className="h-6"
                width={42}
                height={42}
              />
            </div>
            <p className="text-xs text-white">
              &copy; 2025 Payment Gateway Simulation. Powered by <b>Wing Bank (Cambodia) Plc</b>. All transactions are protected by tokenization
              technology.
            </p>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default UnifiedCheckoutPage;
