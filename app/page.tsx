"use client";
import Footer from "@/components/footer";
// import  { useState  } from "react";
import NavigationBar from "@/components/navbar";
import { ProductCardView } from "@/components/product-card";
import ProductCardSkeleton from "@/components/product-skeleton";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ProductProps } from "@/constants";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function App() {
  const [filter, setFilter] = useState("all");
  const [products, setProducts] = useState<ProductProps[]>([]);
  const [loading, setLoading] = useState(true);
  const categories = ["all", "iced_coffee", "iced_frappe", "hot_coffee"];

  const filteredProducts = products.filter(
    (p) => filter === "all" || p.category === filter
  );

  const getProducts = async () => {
    setLoading(true);
    try {
      const response = await fetch("/coffees.json");
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getProducts();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <NavigationBar />
      <main className="w-full max-w-7xl mx-auto px-6 py-8">
        <div className="animate-fadeIn">
          <div className="relative h-100 md:h-112.5 bg-[#2C1810] rounded-2xl overflow-hidden mb-8 flex items-center shadow-lg">
            <div className="absolute inset-0 bg-linear-to-r from-[#2C1810] via-[#2C1810]/80 to-transparent z-10" />
            <Image
              src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&q=80&w=2070"
              className="absolute inset-0 w-full h-full object-cover"
              width={2070}
              height={1334}
              alt="Coffee background"
            />
            <div className="z-20 max-w-xl pl-6 md:pl-12">
              <span className="inline-block px-4 py-3 bg-emerald-900/25 text-emerald-400 rounded-full text-xs font-bold uppercase tracking-widest mb-4">
                Crafted with Passion
              </span>
              <h2 className="text-3xl md:text-6xl font-bold mb-6 text-white leading-tight">
                Better Coffee, <br />
                <span className="text-emerald-600">Better Days.</span>
              </h2>
              <p className="text-stone-300 text-lg mb-8 leading-relaxed">
                Experience the artisan taste of Coffee Hub. Hand-picked beans
                roasted to perfection and delivered fresh to your cup.
              </p>
              <Button
                variant={"secondary"}
                size={"lg"}
                className="bg-emerald-600 hover:bg-emerald-700 px-12 py-6 text-white rounded-md font-bold transition-all transform hover:scale-105 shadow-lg"
              >
                Explore Menu
              </Button>
            </div>
          </div>
        </div>

        <div className="flex w-full flex-col gap-6">
          <Tabs defaultValue={filter} onValueChange={setFilter}>
            <TabsList className="flex gap-2 bg-transparent">
              {categories.map((cat) => (
                <TabsTrigger
                  key={cat}
                  value={cat}
                  className="capitalize px-2 md:px-6 py-4 md:py-6 rounded-md transition-all duration-300 text-xs md:text-sm font-semibold tracking-wide bg-slate-100 text-slate-600 hover:bg-slate-200 data-[state=active]:bg-emerald-600 data-[state=active]:hover:bg-emerald-700 data-[state=active]:text-white data-[state=active]:shadow-md"
                >
                  {cat.replace("_", " ")}
                </TabsTrigger>
              ))}
            </TabsList>
            <TabsContent value={filter} className="mt-5">
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-6">
                {loading &&
                  Array.from({ length: 8 }).map((_, index) => (
                    <ProductCardSkeleton key={index} />
                  ))}

                {filteredProducts.map((p) => (
                  <ProductCardView key={p.id} product={p} />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
}
