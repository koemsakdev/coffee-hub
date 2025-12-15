
import Image from "next/image";
import {Button} from "@/components/ui/button";
import {Plus} from "lucide-react";
import { useCartStore} from "@/stores/cartStore";
import {cn} from "@/lib/utils";

interface ProductCardGridProps {
    id: number;
    name: string;
    description: string;
    price: string;
    category: string;
    imageUrl: string;
}


export const ProductCardGrid = ({ product }: { product: ProductCardGridProps }) => {
    const addToCart = useCartStore((state) => state.addToCart);
    const quantity = useCartStore((state) => state.getQuantityById(product.id));

    return (
        <div className={"bg-white rounded-md shadow-md hover:shadow-lg transition-shadow duration-200 relative"}>
            <div className={"flex flex-col justify-between h-full rounded-md shadow-none"}>
                <Image
                    src={product.imageUrl}
                    alt={product.name}
                    className={"rounded-t-md"}
                    width={500}
                    height={500}
                    style={{ width: "100%", height: "auto" }}
                />

                <div className="p-3">
                    <h3 className="text-lg font-bold line-clamp-1">{product.name}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-1">{product.description}</p>
                    <div className="flex justify-between items-center mt-3">
                        <p className="text-teal-700 text-xl font-bold">${Number(product.price).toFixed(2)}</p>
                        <Button
                            onClick={() => addToCart(product)}
                            variant={"secondary"}
                            size={"icon"}
                            className={"bg-teal-600 hover:bg-teal-700 text-white rounded-full"}
                        >
                            <Plus />
                        </Button>
                    </div>
                </div>
            </div>

            {quantity > 0 && (
                <span className={cn(
                    "absolute -top-1 -left-1 h-8 w-8 md:h-10 md:w-10 animate-in fade-in flex items-center justify-center",
                    "rounded-full bg-sky-600 font-bold text-white shadow-md ring-2 ring-white"
                )}>
                    {quantity > 99 ? "99+" : quantity > 0 ? quantity : ""}
                </span>
            )}

        </div>
    );
};