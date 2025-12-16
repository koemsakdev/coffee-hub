"use client";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { OrderCard } from "@/components/order-card";
import { useCartStore } from "@/stores/cartStore";
import { cn } from "@/lib/utils";
import { useCallback, useEffect, useState, useTransition } from "react";
import { generateUniqueId } from "@/utils";
import { ArrowLeft } from "lucide-react";


const CartPage = () => {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    setHydrated(true);
  }, []);

  const cartItems = useCartStore((state) => state.getCartItems());
  const totalAmount = useCartStore((state) => state.getTotalAmount());
  const clearCart = useCartStore((state) => state.clearCart);
  const [account, setAccount] = useState("");

  const [isPaymentPending, startPaymentTransition] = useTransition();

  const handleCheckout = useCallback(() => {
    startPaymentTransition(async () => {

      const amount = totalAmount.toFixed(2);
      const currency = "USD";

      const res = await fetch("/api/capture-context", {
        method: "POST"
      });
      const data = await res.json();

      const script = document.createElement("script");
      script.src = "https://apitest.cybersource.com/up/v1/assets/checkout.js";
      script.onload = () => {
        // @ts-ignore
        CyberSource.checkout({
          captureContext: data.captureContext
        });
      };

      document.body.appendChild(script);
    });
  }, [account, totalAmount]);

  useEffect(() => {
    const newAccount = generateUniqueId("coffee");
    setAccount(newAccount);
  }, [cartItems, clearCart, totalAmount]);

  if (!hydrated) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col pb-44 mx-auto w-full md:w-5xl">
      <div className="container mx-auto p-4">
        <Link href={'/'}>
          <Button className="rounded-sm" variant={"secondary"}>
            <ArrowLeft />
            <span>Back</span>
          </Button>
        </Link>

        <div className="mt-2 mb-25 p-6 bg-white rounded-lg shadow-md flex-1 flex flex-col">
          <div className={"flex justify-between items-center"}>
            <h1 className="text-sm font-bold text-slate-700/75">
              Your Order(s)
            </h1>
            {cartItems.length > 0 && (
              <h1 className="text-sm font-bold text-slate-700/75">
                Order ID: <strong className="text-black">#{account}</strong>
              </h1>
            )}
          </div>

          <Separator className="my-4" />

          {cartItems.length === 0 ? (
            <div className="my-4">
              <p className="text-gray-600 text-center">
                Your cart is currently empty.
              </p>
              <p className="text-gray-500 mt-2 text-center">
                Start shopping to add items to your cart.
              </p>
              <div className="flex justify-center mt-6">
                <Button
                  variant="secondary"
                  size={"sm"}
                  className="w-full max-w-md bg-teal-700 hover:bg-teal-800 text-white rounded-xs"
                  asChild
                >
                  <Link href={"/"}>Start Shopping</Link>
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 pr-4">
              {cartItems.map((item, index) => (
                <div key={item.id}>
                  <OrderCard cardItem={item} />
                  <Separator
                    className={cn(
                      "mt-4",
                      index === cartItems.length - 1 ? "hidden" : "block"
                    )}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 2. fixed bottom bar always at bottom */}
      {cartItems.length > 0 && (
        <div
          className={cn(
            "bg-white rounded-t-2xl backdrop-blur-sm px-6 py-2 md:px-8 md:py-4 fixed bottom-0 right-0 w-full z-50",
            "shadow-[inset_0_1px_20px_rgba(0,0,0,0.1)]"
          )}
        >
          <div className="py-3">
            <p className="text-muted-foreground text-lg font-bold">Summary</p>
            <Separator className="my-3" />
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">Sub total:</span>
              <span className="text-sm font-bold text-gray-900">
                ${totalAmount.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">Delivery fee:</span>
              <span className="text-sm font-bold text-gray-900">
                ${(0).toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between items-cente mb-2">
              <span className="text-sm text-gray-600">Tax fee:</span>
              <span className="text-sm font-bold text-gray-900">
                ${(0).toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">Total Amount:</span>
              <span className="text-sm font-bold text-gray-900">
                ${totalAmount.toFixed(2)}
              </span>
            </div>
          </div>

          <Button
            disabled={isPaymentPending}
            onClick={handleCheckout}
            variant={"secondary"}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white rounded-xs shadow-md mb-4"
          >
            {isPaymentPending ? "Processing..." : "CHECKOUT"}
          </Button>
        </div>
      )}
    </div>
  );
};

export default CartPage;
