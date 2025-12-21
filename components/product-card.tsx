import { useCartStore } from "@/stores/cartStore";
import { Heart, Plus, Star } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { Button } from "./ui/button";

interface ProductCardViewProps {
  id: number;
  name: string;
  description: string;
  price: string;
  category: string;
  imageUrl: string;
  rating: number;
}

export const ProductCardView = ({
  product,
}: {
  product: ProductCardViewProps;
}) => {
  const addToCart = useCartStore((state) => state.addToCart);
  const [wishlist, setWishlist] = useState<number[]>([]);
  const toggleWishlist = (id: number) => {
    setWishlist((prev) =>
      prev.includes(id) ? prev.filter((wid) => wid !== id) : [...prev, id]
    );
  };

  return (
    <div
      key={product.id}
      className="group relative bg-white rounded-md border border-stone-100 transition-all duration-500 hover:shadow-[0_20px_50px_rgba(44,24,16,0.1)] hover:-translate-y-2"
    >
      <div className="relative aspect-square rounded-t-md overflow-hidden mb-5 bg-stone-50">
        <Image
          src={product.imageUrl}
          alt={product.name}
          sizes="(max-width: 768px) 100vw, 25vw"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          fill
        />

        {/* Badge Overlays */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          <div className="bg-white/90 backdrop-blur-md p-2 md:p-3 rounded-2xl flex items-center gap-1 shadow-none">
            <Star size={14} className="fill-yellow-400 text-yellow-400" />
            <span className="text-xs font-bold text-stone-800">
              {product.rating}
            </span>
          </div>
        </div>

        <Button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          variant={"ghost"}
          className={`absolute top-4 right-4 px-1 md:px-2 py-2 md:py-5 rounded-full backdrop-blur-md transition-all duration-300 ${
            wishlist.includes(product.id)
              ? "bg-emerald-500 text-white hover:bg-emerald-600 hover:text-white"
              : "bg-white text-stone-400 hover:text-red-500"
          }`}
        >
          <Heart
            size={18}
            fill={wishlist.includes(product.id) ? "currentColor" : "none"}
          />
        </Button>

        {/* Hover Quick Add */}
        <div className="absolute inset-x-4 bottom-4 translate-y-24 opacity-100 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 z-20">
          <Button
            variant={"outline"}
            onClick={() => addToCart(product)}
            className="w-full bg-emerald-700/50 hover:bg-emerald-800/75 border-0 backdrop-blur-3xl text-white hover:text-white py-6 rounded-full font-bold flex items-center justify-center gap-2 shadow-2xl active:scale-95"
          >
            <Plus size={20} /> Add to Order
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 pb-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-bold text-lg md:text-xl line-clamp-2 text-stone-800 tracking-tight group-hover:text-[#6F4E37] transition-colors">
            {product.name}
          </h3>
          <span className="text-md md:text-lg font-black text-[#2C1810]">
            ${parseFloat(product.price).toFixed(2)}
          </span>
        </div>
        <p className="text-stone-400 text-sm leading-relaxed line-clamp-2 h-10">
          {product.description}
        </p>
      </div>
    </div>
  );
};
