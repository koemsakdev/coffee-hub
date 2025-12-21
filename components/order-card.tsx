import Image from "next/image";
import { Minus, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/stores/cartStore";

interface OrderCardProps {
  cardItem: {
    id: number;
    name: string;
    description: string;
    price: string;
    category: string;
    imageUrl: string;
    quantity: number;
  };
}

export const OrderCard = ({ cardItem }: OrderCardProps) => {
  const updateCartItem = useCartStore((state) => state.updateCartItem);

  const handleDelete = () => {
    updateCartItem(cardItem.id, 0);
  };

  return (
    <div className="bg-white p-3 rounded-lg border border-stone-100 flex items-center gap-3 box-border shadow-sm transition-all hover:shadow-md">
      <div className="w-17 md:w-18 h-17 md:h-18 rounded-md overflow-hidden shrink-0">
        <Image
          src={cardItem.imageUrl}
          alt={cardItem.name}
          className="w-full h-full object-cover"
          width={96}
          height={96}
          style={{
            maskImage:
              "radial-gradient(circle at center, black 65%, transparent 95%)",
            WebkitMaskImage:
              "radial-gradient(circle at center, black 65%, transparent 95%)",
          }}
        />
      </div>
      <div className="grow">
        <h4 className="font-bold md:text-sm lg:text-lg line-clamp-2 text-stone-800 mb-1">
          {cardItem.name}
        </h4>
        <p className="text-[#D4A373] font-black">
          ${parseFloat(cardItem.price).toFixed(2)}
        </p>
      </div>
      <div className="flex flex-col items-end gap-2">
        <Button
          variant={"secondary"}
          onClick={() => handleDelete()}
          className="text-red-400 hover:text-red-500 transition-colors bg-transparent hover:bg-transparent"
        >
          <Trash2 size={20} />
        </Button>
        <div className="flex items-center bg-stone-50 rounded-sm border border-stone-100">
          <Button
            variant={"secondary"}
            disabled={cardItem.quantity === 1}
            onClick={() => updateCartItem(cardItem.id, cardItem.quantity - 1)}
            className="p-2 text-stone-400 hover:text-stone-800 bg-transparent hover:bg-transparent"
          >
            <Minus size={16} />
          </Button>
          <span className="w-4 text-center font-bold text-stone-800">
            {cardItem.quantity}
          </span>
          <Button
            variant={"secondary"}
            onClick={() => updateCartItem(cardItem.id, cardItem.quantity + 1)}
            className="p-2 text-stone-400 hover:text-stone-800 bg-transparent hover:bg-transparent"
          >
            <Plus size={16} />
          </Button>
        </div>
      </div>
    </div>
  );
};
