"use client";

import Footer from "@/components/footer";
import NavigationBar from "@/components/navbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BadgeCheck, CircleX, Copy, CopyCheck, Landmark } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { decodeJWT, formatDateTime } from "@/utils";
import { useRef, useState } from "react";
import React from "react";

const FailPage = ({ searchParams }: { searchParams: Promise<{ token?: string }>; }) => {
  const router = useRouter();
  const pRef = useRef<HTMLParagraphElement>(null);
  const { token } = React.use(searchParams);
  const [isCopied, setIsCopied] = useState(false);

  if (!token) {
    router.replace("/");
    return null;
  }

  const data = decodeJWT(token);

  const copyText = async () => {
    if (!pRef.current) return;
    const text = pRef.current.textContent;
    await navigator.clipboard.writeText(text || "");
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <NavigationBar />
      <main className="w-full max-w-7xl mx-auto px-6 py-4">
        <div className="w-full max-w-xl mx-auto bg-white p-4 md:p-6 rounded-xl shadow-xl transform transition-all">
          {/* Header */}
          <div className="text-center mb-4">
            <CircleX className="w-16 h-16 text-red-500 rounded-full mx-auto mb-4" />

            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Transaction Failed
            </h1>
            <p className="text-gray-500">{data.message}</p>
          </div>

          {/* Amount */}
          <div className="text-center mb-4 border-b border-t border-gray-100 py-4 bg-red-50 rounded-lg">
            <p className="text-xl text-gray-600 font-semibold mb-2">
              Authorized Amount
            </p>
            <p className="text-5xl font-extrabold text-red-500">
              <span id="amountCurrency"></span>
              <span id="authorizedAmount" className="ml-1">
                $ 00.00
              </span>
            </p>
          </div>

          {/* Data Grid */}
          <div className="space-y-2">
            <div className="w-full bg-slate-50/50 rounded-2xl flex items-center justify-between mt-4">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center">
                  <Landmark className="w-8 h-8 text-red-400 mb-1" />
                </div>
                <div className="flex flex-col gap-0.5">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">
                    Receipt ID
                  </p>
                  <p
                    className="text-xs font-mono font-bold text-red-600 hover:text-red-700"
                    ref={pRef}
                  >
                    {data.id}
                  </p>
                </div>
              </div>
              <button
                onClick={copyText}
                className="p-2 bg-red-50 hover:bg-red-100 rounded-sm transition-all text-red-600 hover:text-red-700"
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
                className="bg-red-50 text-red-500 py-2 px-4 font-semibold"
              >
                DECLINED
                <BadgeCheck />
              </Badge>
            </div>
            <div className="flex justify-between items-center p-1">
              <span className="text-sm font-medium text-gray-500">
                Submitted
              </span>
              <span
                id="submissionTime"
                className="text-sm font-semibold text-gray-800"
              >
                <span
                  id="submissionTime"
                  className="text-sm font-semibold text-gray-800"
                >
                  {data?.details?.submitTimeUtc
                    ? formatDateTime(data.details.submitTimeUtc)
                    : "N/A"}
                </span>
              </span>
            </div>
          </div>

          <div className="mt-4">
            <Button
              variant="secondary"
              onClick={() => router.push("/")}
              className="w-full bg-red-600 text-white py-6 rounded-full text-base md:text-md hover:bg-red-700 transition-all transform active:scale-95"
            >
              Try again with New Payment
            </Button>
          </div>

          <div className="mt-6 flex flex-col gap-2 text-xs text-center text-gray-400">
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
      <Footer />
    </div>
  );
};

export default FailPage;
