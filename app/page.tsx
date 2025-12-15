"use client";

import { useEffect, useState, useMemo } from "react";
import { debounce } from "next/dist/server/utils";
import AppBar from "@/components/app-bar";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LayoutGrid, List, Loader, X } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { ProductCardGrid } from "@/components/product-card-grid";
import { ProductCardList } from "@/components/product-card-list";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ProductProps } from "@/constants";



function Home() {
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const [allProducts, setAllProducts] = useState<ProductProps[]>([]);
  const [userName, setUserName] = useState<string>("Guest");
  const [loading, setLoading] = useState(true);

  const handleChangeMode = (mode: string) => {
    setViewMode(mode);
    localStorage.setItem("viewMode", mode);
  };


  const handleSearchChange = debounce((value: string) => {
    setSearch(value);
    console.log(process.env.NEXT_PUBLIC_PROFILE_LEVEL);
  }, 100);

  const products = useMemo(() => {
    if (!search.trim()) {
      return allProducts;
    }
    return allProducts.filter((product) =>
      product.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, allProducts]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await fetch("/coffees.json");
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setAllProducts(data); // Cache the products
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleClearSearch = () => {
    setSearch("");
  };

  useEffect(() => {
    const savedViewMode = localStorage.getItem("viewMode");
    if (savedViewMode) {
      setViewMode(savedViewMode);
    }

    fetchProducts();
  }, []);

  return (
    <>
      <div className="container mx-auto px-6 md:px-5 py-10 mb-20 w-full md:w-5xl">
        <div className="flex justify-between items-center mb-5">
          <h1 className="text-lg md:text-2xl font-bold text-sky-900">
            សូមស្វាគមន៍មកាន់, <strong>Coffee Hub</strong>
          </h1>
        </div>

        <div className="grid w-full items-center gap-3">
          <Label htmlFor="search">Search Coffee</Label>
          <div className="flex items-center justify-between gap-2">
            <div className="relative">
              <Input
                onChange={(e) => handleSearchChange(e.target.value)}
                value={search}
                type="text"
                id="search"
                placeholder="Search..."
                className="rounded-sm shadow-none w-60 md:w-75 outline-0 focus-visible:shadow-none focus:shadow-none ring-0 focus:ring-0"
                autoComplete="off"
              />
              <Button
                onClick={handleClearSearch}
                variant={"ghost"}
                size={"icon"}
                className={cn(
                  "absolute right-0 top-0 bottom-0 mr-2 hover:bg-transparent",
                  search === "" ? "hidden" : "block"
                )}
                aria-label="Clear search"
              >
                <X />
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Button
                onClick={() => handleChangeMode("grid")}
                variant={"secondary"}
                size={"icon"}
                className={cn(
                  "rounded-sm shadow-none",
                  viewMode === "grid" ? "bg-teal-200 hover:bg-teal-300" : ""
                )}
              >
                <LayoutGrid className="size-4 md:size-5 text-teal-700 hover:text-teal-800" />
              </Button>
              <Button
                onClick={() => handleChangeMode("list")}
                variant={"secondary"}
                size={"icon"}
                className={cn(
                  "rounded-sm shadow-none",
                  viewMode === "list" ? "bg-teal-200 hover:bg-teal-300" : ""
                )}
              >
                <List className="size-4 md:size-5 text-teal-700 hover:text-teal-800" />
              </Button>
            </div>
          </div>
        </div>

        <Separator className="my-6" />

        <div className="mt-6">
          <h2 className="text-lg md:text-xl font-semibold text-teal-900">
            The best coffee to make you feel fresh during the work everywhere.
          </h2>
          <div
            className={cn(
              "grid grid-cols-2 gap-4 mt-4",
              viewMode === "grid"
                ? "grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
                : "grid-cols-1 md:grid-cols-2 lg:grid-cols-2"
            )}
          >
            {products.map((product: ProductProps) => {
              return viewMode === "grid" ? (
                <ProductCardGrid key={product.id} product={product} />
              ) : (
                <ProductCardList key={product.id} product={product} />
              );
            })}

            {!loading && products.length === 0 && (
              <div className="col-span-full text-center text-gray-500">
                No products found.
              </div>
            )}
          </div>
        </div>

        <Dialog open={loading}>
          <DialogContent
            className="flex items-center justify-center bg-transparent border-0 outline-0 shadow-none"
            showCloseButton={false}
          >
            <DialogHeader>
              <DialogTitle className="text-center" />
              <DialogDescription className="text-center" />
            </DialogHeader>

            <Loader className="animate-spin size-12 text-white font-bold" />
          </DialogContent>
        </Dialog>
      </div>
      <AppBar isActive={"home"} />
    </>
  );
}

export default Home;