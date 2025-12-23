"use client";
import { Button } from "@/components/ui/button";
import { OrderCard } from "@/components/order-card";
import { useCartStore } from "@/stores/cartStore";
import { ChevronLeft, ChevronRight, ShoppingCart } from "lucide-react";
import NavigationBar from "@/components/navbar";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Footer from "@/components/footer";

const CartPage = () => {
  const router = useRouter();
  const cartItems = useCartStore((state) => state.getCartItems());
  const totalAmount = useCartStore((state) => state.getTotalAmount());

  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    setHydrated(true);
  }, []);
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

        <div className="max-w-7xl mx-auto animate-fadeIn min-h-[60vh]">
          <div className="flex items-center gap-4 mb-12">
            <h2 className="text-4xl font-bold text-stone-800">Your Basket</h2>
            <span className="px-3 py-1 bg-stone-100 rounded-full text-stone-500 font-bold text-sm">
              {cartItems.length} items
            </span>
          </div>

          {cartItems.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-[2rem] border border-dashed border-stone-200 shadow-sm">
              <div className="w-20 h-20 bg-stone-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShoppingCart className="text-stone-300" size={32} />
              </div>
              <p className="text-stone-400 text-lg mb-6">
                Your basket is waiting to be filled with aroma.
              </p>
              <Button
                onClick={() => router.push("/")}
                className="bg-[#2C1810] text-white px-8 py-6 rounded-full font-bold hover:bg-[#4A2C2A] transition-all"
              >
                Start Ordering
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="md:col-span-1 lg:col-span-2 space-y-4">
                {cartItems.map((item) => (
                  <OrderCard key={item.id} cardItem={item} />
                ))}
              </div>

              <div className="bg-white p-4 md:p-8 rounded-lg shadow-sm shadow-stone-200/50 border border-stone-100 h-fit sticky top-24">
                <h3 className="font-bold text-2xl mb-8 text-stone-800">
                  Order Totals
                </h3>
                <div className="space-y-4 mb-8">
                  <div className="flex justify-between text-stone-500">
                    <span>Subtotal</span>
                    <span className="font-semibold text-stone-800">
                      ${totalAmount.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-stone-500">
                    <span>Standard Delivery</span>
                    <span className="font-semibold text-stone-800">$0.00</span>
                  </div>
                  <div className="pt-4 border-t border-stone-100 flex justify-between">
                    <span className="font-bold text-stone-800 text-xl">
                      Grand Total
                    </span>
                    <span className="font-black text-[#2C1810] text-2xl">
                      ${totalAmount.toFixed(2)}
                    </span>
                  </div>
                </div>
                <Button
                  variant={"secondary"}
                  onClick={() => router.push("/checkout")}
                  className="w-full bg-emerald-600 text-white rounded-full font-bold hover:bg-emerald-700 transition-all flex items-center justify-center gap-2 shadow-lg py-6 md:py-7"
                >
                  Continue to Checkout <ChevronRight size={20} />
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CartPage;
