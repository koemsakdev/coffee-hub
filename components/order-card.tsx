import Image from "next/image";
import {Check, Equal, Pencil, Trash2, X} from "lucide-react";
import {Button} from "@/components/ui/button";
import { useCartStore } from "@/stores/cartStore";
import React, {useState} from "react";
import {Input} from "@/components/ui/input";

interface OrderCardProps {
    cardItem: {
        id: number
        name: string
        description: string
        price: string
        category: string
        imageUrl: string
        quantity: number
    },
}

export const OrderCard = ({ cardItem }: OrderCardProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editQty, setEditQty] = useState(cardItem.quantity);
    const [strQty, setStrQty] = useState<string>(cardItem.quantity.toString());
    const updateCartItem = useCartStore((state) => state.updateCartItem);

    const handleSave = () => {
        updateCartItem(cardItem.id, editQty);
        setIsEditing(false);
    };

    const handleEdit = () => {
        setIsEditing(!isEditing);
        setEditQty(cardItem.quantity);
        setStrQty(cardItem.quantity.toString());
    }

    const handleDelete = () => {
        updateCartItem(cardItem.id, 0);
    }

    const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/,/g, "");
        if (value === "") {
            setEditQty(cardItem.quantity);
            setStrQty("");
        } else {
            const numericValue = parseFloat(value);
            if (!isNaN(numericValue)) {
                setEditQty(numericValue);
                setStrQty(numericValue.toString());
            } else {
                setStrQty(editQty.toString());
            }
        }
    }

    const handleEditBlur = () => {
        if (editQty !== cardItem.quantity) {
            updateCartItem(cardItem.id, editQty);
        }
        setIsEditing(false);
    }

    return (
        <div className={"p-0 rounded-md shadow-none"}>
            <div className="flex items-center gap-x-3 p-0">
                <Image src={cardItem.imageUrl} alt={cardItem.name} className={"rounded-md w-1/3 sm:w-1/5 md:w-1/6 lg:w-1/12"} width={200} height={200}  />
                <div className="p-0">
                    <h3 className="text-md font-bold ">{cardItem.name}</h3>
                    <p className="text-xs text-muted-foreground line-clamp-1">{cardItem.description}</p>

                    {!isEditing ? (
                        <p className="text-blue-500 text-sm font-bold flex items-center gap-x-1 mt-2 line-clamp-1">
                            <span>{cardItem.quantity}</span>
                            <X className="size-4" />
                            <span>{Number(cardItem.price).toFixed(2)}</span>
                            <Equal className="size-4" />
                            <span>${Number(cardItem.quantity * Number(cardItem.price)).toFixed(2)}</span>
                        </p>
                    ) : (
                        <div className="mt-2 relative">
                            <Input
                                type="number"
                                min={0}
                                value={strQty}
                                onChange={handleEditChange}
                                onBlur={handleEditBlur}
                                className="hover:bg-transparent text-blue-500 font-bold border border-blue-300 rounded-md pl-2 pr-7 py-1 text-sm w-full outline-0 focus:shadow-none focus-visible:ring-0 focus-visible:border-1 focus-visible:border-blue-500 transition-colors duration-200"
                            />
                            <Button
                                variant={"ghost"}
                                size={"icon"}
                                onClick={handleSave}
                                className="absolute right-1 top-1/2 -translate-y-1/2 text-green-600 hover:bg-transparent hover:text-green-600 focus:ring-0 focus-visible:ring-0 focus-visible:border-0 transition-colors duration-200"
                            >
                                <Check className="size-4" />
                            </Button>

                        </div>
                    )}
                </div>
                <div className={"ml-auto flex flex-col items-end gap-y-2 p-0"}>
                    <Button onClick={handleEdit} variant={"secondary"} size={"sm"} className={"rounded-full bg-lime-500 hover:bg-lime-600 text-white"}>
                        <Pencil className={"size-3"} />
                    </Button>
                    <Button onClick={() => handleDelete()} variant={"secondary"} size={"sm"} className={"rounded-full bg-red-500 hover:bg-red-600 text-white"}>
                        <Trash2 className={"size-3"} />
                    </Button>
                </div>
            </div>
        </div>
    )
}