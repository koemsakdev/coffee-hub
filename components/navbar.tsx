import { Button } from "@/components/ui/button";
import { BadgeDollarSign, Coffee, ShoppingCart } from "lucide-react";
import { useCartStore } from "@/stores/cartStore";
import { useHydratedStore } from "@/hooks/useHydratedStore";
import { useRouter } from "next/navigation";
import Image from "next/image";

const NavigationBar = () => {
  const router = useRouter();
  const cartCount = useHydratedStore((s) => s.getCartCount(), useCartStore);
  return (
    <header className="sticky top-0 z-50 bg-white/20 backdrop-blur-3xl border-b border-stone-100">
      <div className="max-w-7xl mx-auto px-6 h-18 flex items-center justify-between">
        <div
          className="flex items-center gap-3 cursor-pointer group"
          onClick={() => router.push("/")}
        >
            <Image
              src="/logo.jpg"
              alt="logo"
              width={48}
              height={48}
              className="transform group-hover:rotate-12 transition-transform duration-300 rounded-sm"
            />
          <div className="flex flex-col">
            <h1 className="text-2xl font-black tracking-tight leading-none text-emerald-600">
              COFFEE HUB
            </h1>
            <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#a03c15] mt-1">
              Premium Roastery
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant={"secondary"}
            onClick={() => router.push("/cart")}
            className="relative px-3 py-5 bg-emerald-600 hover:bg-emerald-700 rounded-sm text-white transition-all group"
          >
            <ShoppingCart size={24} />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-[#ef9d4b] text-[#2C1810] text-[11px] font-black w-6 h-6 flex items-center justify-center rounded-full border-4 border-white shadow-lg group-hover:scale-110 transition-transform">
                {cartCount}
              </span>
            )}
          </Button>
          <Button
            variant={"secondary"}
            onClick={() => router.push("/settlement")}
            className="px-3 py-5 bg-blue-500 hover:bg-blue-600 rounded-sm text-white transition-all group"
          >
            <BadgeDollarSign size={24} />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default NavigationBar;
