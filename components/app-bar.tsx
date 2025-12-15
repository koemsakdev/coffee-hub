import {Button} from "@/components/ui/button";
import {Home, ShoppingCart} from "lucide-react";
import {useCartStore} from "@/stores/cartStore";
import {cn} from "@/lib/utils";
import Link from "next/link";
import { useHydratedStore } from "@/hooks/useHydratedStore";

const AppBar = ({ isActive } : {isActive: string}) => {
    const cartCount = useHydratedStore(s => s.getCartCount(), useCartStore);
    return (
        <header className="bg-black/25 backdrop-blur-sm px-6 py-2 md:px-8 md:py-4 flex justify-between items-center fixed bottom-0 left-0 right-0 z-50 shadow-none w-full md:w-5xl rounded-t-2xl mx-auto">
            <Button
                variant="secondary"
                size={"icon"}
                asChild
                className={cn(
                    "size-12 md:size-16 rounded-full text-white",
                    isActive === "home" ? "bg-teal-700 hover:bg-teal-800" : "text-black"
                )}
            >
                <Link href={"/"}>
                    <Home className="size-4 md:size-5" />
                </Link>
            </Button>
            <Button
                variant="secondary"
                size="icon"
                className={cn(
                    "size-12 md:size-16 rounded-full text-white",
                    isActive === "cart" ? "bg-teal-700 hover:bg-teal-800" : "text-black"
                )}
                aria-label="Cart"
                asChild
            >
                <Link href={"/carts"} className={"relative"}>
                    <ShoppingCart className="size-4 md:size-5"/>
                    {cartCount > 0 && (
                        <span
                            className={cn(
                                "absolute -top-2 -right-2 flex h-5 w-5 md:h-6 md:w-6 items-center justify-center",
                                "rounded-full bg-red-600 text-[10px] md:text-xs font-bold text-white shadow-lg ring-2 ring-white"
                            )}
                        >
                        {cartCount}
                      </span>
                    )}
                </Link>
            </Button>
            {/* <Button
                asChild
                variant="secondary"
                size={"icon"}
                className={cn(
                    "size-12 md:size-16 rounded-full text-white",
                    isActive === "history" ? "bg-teal-700 hover:bg-teal-800" : "text-black"
                )}
            >
                <Link href={"/history-order"}>
                    <Tickets className="size-4 md:size-5" />
                </Link>
            </Button>
            <Button
                asChild
                variant="secondary"
                size={"icon"}
                className={cn(
                    "size-12 md:size-16 rounded-full text-white",
                    isActive === "profile" ? "bg-teal-700 hover:bg-teal-800" : "text-black"
                )}
            >
                <Link href={"/profile"}>
                    <User className="size-4 md:size-5" />
                </Link>
            </Button> */}
        </header>
    );
}

export default AppBar;