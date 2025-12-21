/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
"use client";

import Footer from "@/components/footer";
import NavigationBar from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useCartStore } from "@/stores/cartStore";
import { decodeJWT } from "@/utils";
import axios from "axios";
import { CheckCircle2, ChevronLeft } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const Checkout = () => {
  const router = useRouter();
  const cartItems = useCartStore((state) => state.getCartItems());
  const totalAmount = useCartStore((state) => state.getTotalAmount());

  const [firstName, setFirstName] = useState("Koemsak");
  const [lastName, setLastName] = useState("Mean");
  const [email, setEmail] = useState("koemsak.mean@gmail.com");
  const [address, setAddress] = useState(
    "# 36B, Street 371, Group 5, Orchide Village, Sangkat Ou Baek K'am, Khan Sen Sok, Phnom Penh."
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [hydrated, setHydrated] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState("card");

  useEffect(() => {
    setHydrated(true);
  }, []);

  const methods = [
    {
      id: "card",
      title: "Debit/Credit Card",
      description: "Pay securely with your Visa, Mastercard, or Amex.",
      icon: "/credit-card.png",
      tag: "Secure",
    },
    {
      id: "cod",
      title: "Cash on Delivery",
      description: "Pay with cash when your order is delivered to your door.",
      icon: "/cash-on-delivery.png",
      tag: "Manual",
    },
  ];

  useEffect(() => {
    if (!hydrated || selectedMethod !== "card") return;
    const setUpUnifiedCheckout = async () => {
      try {
        setLoading(true);
        setError("");
        const payload = JSON.stringify({
          amount: totalAmount.toFixed(2),
          firstName: firstName,
          lastName: lastName,
          email: email,
          address: address,
        });

        // const resp = await axios.post("/api/capture-context", payload, {
        //   headers: {
        //     "Content-Type": "application/json",
        //     Accept: "application/json",
        //   },
        // });

        const resp = await fetch("/api/capture-context", {
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

        console.log(data);
        const token = data.token;

        const clientLibrary = decodeJWT(token).ctx[0].data;
        const libraryUrl = clientLibrary.clientLibrary;
        const integrity = clientLibrary.clientLibraryIntegrity;

        const head = window.document.getElementsByTagName("head")[0];
        const script = window.document.createElement("script");
        script.type = "text/javascript";
        script.async = true;

        script.onload = async function () {
          console.log("JS Is Loaded");
          const showArgs = {
            layout: "sidebar",
            containers: {
              paymentSelection: "#buttonPaymentListContainer",
              paymentScreen: "#embeddedPaymentContainer",
            },
          };

          try {
            // @ts-expect-error
            const accept = await window.Accept(token);
            const up = await accept.unifiedPayments(false);
            const tt = await up.show(showArgs);
            const completeResponse = await up.complete(tt);
            console.log("complete response: ", completeResponse);
            const paymentResponse = decodeJWT(completeResponse);
            console.log("Payment response: ", paymentResponse);

            if (paymentResponse.status === "AUTHORIZED") {
              window.location.assign(
                `http://${window.location.host}/result?reference=${paymentResponse.details.clientReferenceInformation.code}`
              );
            } else {
              setError("Payment declined. Please try another card.");
            }
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
      } catch (error) {
        console.log(error);
        setError("Unable to initialize payment.");
        setLoading(false);
      }
    };
    setUpUnifiedCheckout();
  }, [
    address,
    email,
    firstName,
    hydrated,
    lastName,
    selectedMethod,
    totalAmount,
  ]);

  if (!hydrated) return null;

  return (
    <div className="flex flex-col min-h-screen">
      <NavigationBar />
      <main className="w-full max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center gap-4 mb-12">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-stone-600 hover:text-stone-800 transition-all"
          >
            <ChevronLeft size={20} />
            <span>Back</span>
          </button>
        </div>
        <h2 className="text-4xl font-bold text-stone-800">Final Step</h2>
        <Separator className="my-8" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div className="space-y-12">
            <section>
              <h3 className="text-xl font-bold mb-6 text-stone-800 flex items-center gap-3 underline decoration-emerald-600 decoration-2 underline-offset-8">
                Delivery Address
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  type="text"
                  placeholder="First Name"
                  className="px-3 py-5 bg-white border border-stone-200 rounded-md focus-visible:ring-2 focus-visible:ring-emerald-600 outline-none"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  autoFocus
                />
                <Input
                  type="text"
                  placeholder="Last Name"
                  className="px-3 py-5 bg-white border border-stone-200 rounded-md focus-visible:ring-2 focus-visible:ring-emerald-600 outline-none"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
                <Input
                  type="email"
                  placeholder="Email Address"
                  className="col-span-2 px-3 py-5 bg-white border border-stone-200 rounded-md focus-visible:ring-2 focus-visible:ring-emerald-600 outline-none"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Textarea
                  placeholder="Apartment, suite, unit, building, floor, etc."
                  className="col-span-2 px-3 py-5 bg-white border border-stone-200 rounded-md focus-visible:ring-2 focus-visible:ring-emerald-600 outline-none"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>
            </section>

            <section>
              <div className="mb-6">
                <h3 className="text-xl font-bold text-stone-800 flex items-center gap-3">
                  Payment Method
                </h3>
                <p className="text-slate-500 mt-1 text-sm">
                  Choose how you&apos;d like to pay for your order.
                </p>
              </div>

              <div className="space-y-4">
                {methods.map((method) => {
                  const isSelected = selectedMethod === method.id;

                  return (
                    <button
                      key={method.id}
                      onClick={() => setSelectedMethod(method.id)}
                      className={`w-full relative flex items-start gap-4 p-4 rounded-md border-2 transition-all duration-200 text-left outline-none focus:ring-1 focus:ring-emerald-500 outline-0 ${
                        isSelected
                          ? "border-emerald-600 bg-emerald-400/25 hover:bg-emerald-400/30 shadow-sm"
                          : "border-slate-100 hover:border-slate-300 bg-white"
                      }`}
                    >
                      <div className="w-14 h-14 flex items-center justify-center">
                        <Image
                          src={method.icon}
                          alt={method.title}
                          width={38}
                          height={38}
                        />
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span
                            className={`font-medium ${
                              isSelected && "text-emerald-600"
                            }`}
                          >
                            {method.title}
                          </span>
                          {isSelected && (
                            <CheckCircle2 className="w-5 h-5 text-emerald-600 animate-in zoom-in duration-300" />
                          )}
                        </div>
                        <p
                          className={cn(
                            "text-sm",
                            isSelected && "text-emerald-700"
                          )}
                        >
                          {method.description}
                        </p>
                      </div>

                      {isSelected && (
                        <span className="absolute -top-2 -right-2 bg-[#d2883d] text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm uppercase tracking-wider">
                          {method.tag}
                        </span>
                      )}
                    </button>
                  );
                })}

                {selectedMethod === "card" ? (
                  <div className="space-y-4">
                    {/* Loading Skeleton */}
                    {loading && (
                      <div className="space-y-3">
                        <div className="h-12 rounded-full bg-white/10 animate-pulse" />
                        <div className="h-['320px'] rounded-xl bg-white/10 animate-pulse" />
                      </div>
                    )}

                    {/* Error */}
                    {error && (
                      <div className="p-3 rounded-md bg-red-500/10 text-red-400 text-sm">
                        {error}
                      </div>
                    )}

                    {/* Unified Checkout Buttons */}
                    <div
                      id="buttonPaymentListContainer"
                      className="min-h-['56px']"
                    />

                    {/* Embedded Payment UI */}
                    <div
                      id="embeddedPaymentContainer"
                      className="min-h-['420px'] rounded-xl border border-white/10 overflow-hidden bg-white"
                    />
                  </div>
                ) : (
                  <Button
                    variant="secondary"
                    className="w-full bg-emerald-600 text-white py-6 rounded-full text-base md:text-lg hover:bg-emerald-700 transition-all transform active:scale-95"
                    disabled={loading}
                  >
                    Confirm Order
                  </Button>
                )}
              </div>
            </section>
          </div>
          <div className="bg-emerald-900/95 backdrop-blur-3xl p-4 md:p-6 rounded-lg text-emerald-400 h-fit sticky top-24 shadow-sm">
            <h3 className="font-bold text-2xl mb-8">Summary</h3>
            <div className="max-h-['300px'] overflow-y-auto mb-8 space-y-5 pr-4 custom-scrollbar">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between items-center group"
                >
                  <div className="flex gap-4 items-center">
                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-white/10 p-1">
                      <Image
                        src={item.imageUrl}
                        className="w-full h-full object-cover rounded-lg"
                        width={48}
                        height={48}
                        priority
                        alt={item.name}
                      />
                    </div>
                    <div>
                      <p className="font-bold text-stone-200 group-hover:text-white transition-colors">
                        {item.name}
                      </p>
                      <p className="text-xs text-stone-400">
                        {item.quantity} units
                      </p>
                    </div>
                  </div>
                  <span className="font-black text-[#D4A373]">
                    ${(parseFloat(item.price) * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-white/10 pt-8 space-y-4 mb-10">
              <div className="flex justify-between text-stone-400 font-medium">
                <span>Subtotal</span>
                <span>${totalAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-stone-400 font-medium">
                <span>Delivery</span>
                <span>$0.50</span>
              </div>
              <div className="flex justify-between font-black text-3xl pt-4">
                <span>Total</span>
                <span className="text-[#D4A373]">
                  ${(totalAmount + 0.5).toFixed(2)}
                </span>
              </div>
            </div>
            {/* <Button
              variant={"secondary"}
              className="w-full bg-emerald-600 text-white py-6 rounded-full text-base md:text-lg hover:bg-emerald-700 transition-all transform active:scale-95"
            >
              Confirm Order
            </Button> */}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Checkout;
