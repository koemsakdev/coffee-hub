"use client";
import Image from "next/image";
import {Button} from "@/components/ui/button";
import {Plus} from "lucide-react";
import {useCartStore} from "@/stores/cartStore";
import {cn} from "@/lib/utils";

interface ProductCardListProps {
    id: number;
    name: string;
    description: string;
    price: string;
    category: string;
    imageUrl: string;
}

export const ProductCardList = ({ product }: { product: ProductCardListProps }) => {
    const addToCart = useCartStore((state) => state.addToCart);
    const quantity = useCartStore((state) => state.getQuantityById(product.id));
    return (
        <div className={"bg-white px-5 py-4 rounded-md shadow-md hover:shadow-lg transition-shadow duration-200 relative"}>
            <div className="flex justify-between items-center">
                <div className="p-3">
                    <h3 className="text-lg font-bold line-clamp-1">{product.name}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">{product.description}</p>
                    <p className="text-teal-700 text-xl font-bold">${Number(product.price).toFixed(2)}</p>
                </div>
                <Image src={product.imageUrl} alt={"Coffee"} className={"rounded-md"} width={200} height={200} style={{ width: "30%", height: "auto" }} />
            </div>
            <Button onClick={() => addToCart(product)} size={"sm"} variant={"secondary"} className={"bg-teal-500 hover:bg-teal-600 text-white rounded-xs w-full mt-5"}>
                <Plus /> Add to Cart
            </Button>

            {quantity > 0 && (
                <span className={cn(
                    "absolute -top-1 -left-1 h-8 w-8 md:h-10 md:w-10 animate-in fade-in flex items-center justify-center",
                    "rounded-full bg-sky-600 font-bold text-white shadow-md ring-2 ring-white"
                )}>
                    {quantity}
                </span>
            )}
        </div>
    )
}