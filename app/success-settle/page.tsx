"use client";

import NavigationBar from "@/components/navbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BadgeCheck, BadgeDollarSign, CircleCheck, Clock, Copy, CopyCheck, Landmark } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { base64Decode, formatDateTime } from "@/utils";
import { useRef, useState } from "react";
import React from "react";
import { cn } from "@/lib/utils";

const SuccessPage = ({ searchParams }: { searchParams: Promise<{ token?: string }>; }) => {
  const router = useRouter();
  const { token } = React.use(searchParams);
  const [isCopied, setIsCopied] = useState(false);
  const [isSCopied, setIsSCopied] = useState(false);
  const pValue = useRef<HTMLParagraphElement>(null);
  const sValue = useRef<HTMLParagraphElement>(null);

  if (!token) {
    router.replace("/");
    return null;
  }

  const data = base64Decode(token);
  console.log("Decoded Token Data:", data);

  const copyText = async () => {
    if (!pValue.current) return;
    const text = pValue.current.textContent;
    await navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const copyRefText = async () => {
    if (!sValue.current) return;
    const text = sValue.current.textContent;
    await navigator.clipboard.writeText(text);
    setIsSCopied(true);
    setTimeout(() => setIsSCopied(false), 2000);
  };
  return (
    <div className="flex flex-col min-h-screen">
      <NavigationBar />
      <main className="w-full max-w-7xl mx-auto px-6 py-4">
        <div className="w-full max-w-xl mx-auto bg-white p-4 md:p-6 rounded-xl shadow-xl transform transition-all">
          {/* Header */}
          <div className="text-center mb-4">
            <CircleCheck className="w-16 h-16 text-green-500 rounded-full mx-auto mb-4" />

            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Payment Capure Successfully
            </h1>
          </div>

          {/* Amount */}
          <div className="text-center mb-4 border-b border-t border-gray-100 py-4 bg-green-50 rounded-lg">
            <p className="text-xl text-gray-600 font-semibold mb-2">
              Authorized Amount
            </p>
            <p className="text-5xl font-extrabold text-green-500">
              <span id="amountCurrency"></span>
              <span id="authorizedAmount" className="ml-1">
                {data.orderInformation?.amountDetails?.currency} {data.orderInformation?.amountDetails?.totalAmount}
              </span>
            </p>
          </div>

          {/* Data Grid */}
          <div className="space-y-2">

            <div className="w-full rounded-2xl flex items-center justify-between mt-4">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center">
                  <BadgeDollarSign className="w-8 h-8 text-emerald-400 mb-1" />
                </div>
                <div className="flex flex-col gap-0.5">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">
                    Reconciliation ID
                  </p>
                  <p className="text-xs font-mono font-bold text-emerald-600 hover:text-emerald-700" ref={pValue}>
                    {data.reconciliationId}
                  </p>
                </div>
              </div>
              <button
                onClick={copyText}
                className="p-2 bg-emerald-50 hover:bg-emerald-100 rounded-sm transition-all text-emerald-600 hover:text-emerald-700"
              >
                {isCopied ? (
                  <CopyCheck className="w-4 h-4" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>

            <div className="flex justify-between items-center p-1">
              <span className="text-sm font-medium text-gray-500">Status</span>
              <Badge
                variant="secondary"
                className={cn(
                  "py-1 px-2 font-semibold rounded-md",
                  data.status === "AUTHORIZED"
                    ? "bg-green-50 text-green-500"
                    : "bg-orange-50 text-orange-500"
                )}
              >
                {data.status}
                {
                  data.status === "AUTHORIZED" ? <BadgeCheck /> : <Clock />
                }
              </Badge>
            </div>

            <div className="flex justify-between items-center p-1">
              <span className="text-sm font-medium text-gray-500">
                Reference Code
              </span>
              <span className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                <span ref={sValue}>{data?.clientReferenceInformation?.code
                  ? data?.clientReferenceInformation?.code
                  : "N/A"}</span>

                <button
                  onClick={copyRefText}
                  className="p-0"
                >
                  {isSCopied ? (
                    <CopyCheck className="w-4 h-4" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </span>
            </div>

            <div className="flex justify-between items-center p-1">
              <span className="text-sm font-medium text-gray-500">
                Submitted
              </span>
              <span className="text-sm font-semibold text-gray-800">
                {data?.submitTimeUtc
                  ? formatDateTime(data?.submitTimeUtc)
                  : "N/A"}
              </span>
            </div>
          </div>

          <div className="mt-4">
            <Button
              variant="secondary"
              onClick={() => router.push("/")}
              className="w-full uppercase bg-emerald-600 text-white py-6 rounded-full text-base md:text-md hover:bg-emerald-700 transition-all transform active:scale-95"
            >
              Proceed
            </Button>
          </div>

          <div className="mt-3 flex flex-col gap-2 text-xs text-center text-gray-400">
            Powered by:
            <Image
              src="/wb-logo.svg"
              alt="Wing Bank"
              width={100}
              height={100}
              className="object-center mx-auto"
            />
          </div>
        </div>
      </main>
      {/* <Footer /> */}
    </div>
  );
};

export default SuccessPage;
