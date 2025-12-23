"use client";

import Footer from "@/components/footer";
import JsonEditor from "@/components/json-editor";
import NavigationBar from "@/components/navbar";
import {Accordion, AccordionContent, AccordionItem, AccordionTrigger} from "@/components/ui/accordion";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Separator} from "@/components/ui/separator";
import {Textarea} from "@/components/ui/textarea";
import {useCartStore} from "@/stores/cartStore";
import {ChevronLeft} from "lucide-react";
import Image from "next/image";
import {useRouter} from "next/navigation";
import {useEffect, useState} from "react";


const INITIAL_JSON = {
    "targetOrigins": [
        "https://stageonline.wingmoney.com",
        "https://localhost:3000",
        "https://coffee-hub-beta.vercel.app"
    ],
    "clientVersion": "0.32",
    "allowedCardNetworks": [
        "VISA",
        "MASTERCARD",
        "AMEX"
    ],
    "allowedPaymentTypes": [
        "PANENTRY"
    ],
    "country": "KH",
    "locale": "en_US",
    "captureMandate": {
        "billingType": "NONE",
        "requestEmail": false,
        "requestPhone": false,
        "requestShipping": false,
        "shipToCountries": [
            "KH"
        ],
        "showAcceptedNetworkIcons": true
    },
    "completeMandate": {
        "type": "AUTH",
        "decisionManager": true,
        "consumerAuthentication": true
    },
    "orderInformation": {
        "amountDetails": {
            "totalAmount": "10.00",
            "currency": "USD"
        },
        "billTo": {
            "address1": "No 22, St Lum, Tagnov Kandal, Nirouth, Chba Ampove",
            "administrativeArea": "KH-12",
            "buildingNumber": "22",
            "country": "KH",
            "district": "Niroth",
            "locality": "Phnom Penh",
            "postalCode": "10172",
            "email": "neth.phan@wingbank.com.kh",
            "firstName": "Neth",
            "lastName": "Phan",
            "middleName": "M",
            "title": "Mr",
            "phoneNumber": "85577773783"
        }
    }
};

const Checkout = () => {
    const router = useRouter();
    const cartItems = useCartStore((state) => state.getCartItems());
    const totalAmount = useCartStore((state) => state.getTotalAmount());

    const [initJson, setInitJson] = useState(INITIAL_JSON);

    const [firstName, setFirstName] = useState("Koemsak");
    const [lastName, setLastName] = useState("Mean");
    const [email, setEmail] = useState("koemsak.mean@gmail.com");
    const [address, setAddress] = useState(
        "No 22, St Lum, Tagnov Kandal, Nirouth, Chba Ampove"
    );

    const [hydrated, setHydrated] = useState(false);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setHydrated(true);
    }, []);

    useEffect(() => {
        const stored = localStorage.getItem("capture-context");

        // 1 If a user already has a saved config → use it and STOP
        if (stored) {
            try {
                // eslint-disable-next-line react-hooks/set-state-in-effect
                setInitJson(JSON.parse(stored));
                return;
            } catch {
            }
        }

        // 2 Otherwise derive initial JSON from inputs
        setInitJson(prev => ({
            ...prev,
            orderInformation: {
                ...prev.orderInformation,
                amountDetails: {
                    ...prev.orderInformation.amountDetails,
                    totalAmount: Number(totalAmount).toFixed(2),
                },
                billTo: {
                    ...prev.orderInformation.billTo,
                    address1: address,
                    firstName,
                    lastName,
                    email,
                },
            },
        }));
    }, [firstName, lastName, totalAmount, email, address]);


    const handleSave = (value: object) => {
        localStorage.setItem("capture-context", JSON.stringify(value, null, 4));
        setInitJson(JSON.parse(JSON.stringify(value, null, 4)));

        alert("Data saved. \nThe data will be reset after payment completed or when you click reset button.")
    };

    const handleReset = () => {
        localStorage.removeItem("capture-context");
        setInitJson(INITIAL_JSON);
        window.location.reload();
    };

    const goNext = () => {
        localStorage.setItem("payload", JSON.stringify(initJson));
        router.push("/unified-checkout");
    };

    if (!hydrated) return null;

    return (
        <div className="flex flex-col min-h-screen">
            <NavigationBar/>
            <main className="w-full max-w-7xl mx-auto px-6 py-8">
                <div className="flex items-center gap-4 mb-12">
                    <button
                        onClick={() => router.back()}
                        className="flex items-center gap-2 text-stone-600 hover:text-stone-800 transition-all"
                    >
                        <ChevronLeft size={20}/>
                        <span>Back</span>
                    </button>
                </div>
                <h2 className="text-4xl font-bold text-stone-800">Final Step</h2>
                <Separator className="my-8"/>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                    <div className="space-y-8">
                        <section>
                            <h3 className="text-xl font-bold mb-6 text-stone-800 flex items-center gap-3 underline decoration-emerald-600 decoration-2 underline-offset-8">
                                Delivery Address
                            </h3>
                            <div className="grid grid-cols-2 gap-4">
                                <Input
                                    type="text"
                                    placeholder="First Name"
                                    className="px-3 py-5 bg-white border border-stone-200 rounded-md focus-visible:ring-2 focus-visible:ring-emerald-600 outline-none"
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                />
                                <Input
                                    type="text"
                                    placeholder="Last Name"
                                    className="px-3 py-5 bg-white border border-stone-200 rounded-md focus-visible:ring-2 focus-visible:ring-emerald-600 outline-none"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                />
                                <Input
                                    type="email"
                                    placeholder="Email Address"
                                    className="col-span-2 px-3 py-5 bg-white border border-stone-200 rounded-md focus-visible:ring-2 focus-visible:ring-emerald-600 outline-none"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                                <Textarea
                                    placeholder="Apartment, suite, unit, building, floor, etc."
                                    className="col-span-2 px-3 py-5 bg-white border border-stone-200 rounded-md focus-visible:ring-2 focus-visible:ring-emerald-600 outline-none"
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                />
                            </div>
                        </section>
                        <Accordion type="single" collapsible>
                            <AccordionItem value="item-1">
                                <AccordionTrigger className="bg-slate-100 px-4">View Capture Context</AccordionTrigger>
                                <AccordionContent>
                                    <JsonEditor
                                        INITIAL_JSON={initJson}
                                        onSave={handleSave}
                                        onReset={handleReset}
                                    />
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    </div>
                    <div
                        className="bg-emerald-900/95 backdrop-blur-3xl p-4 md:p-6 rounded-lg text-emerald-400 h-fit sticky top-24 shadow-sm">
                        <h3 className="font-bold text-2xl mb-8">Summary</h3>
                        <div className="max-h-['300px'] overflow-y-auto mb-8 space-y-5 pr-4 custom-scrollbar">
                            {cartItems.map((item) => (
                                <div
                                    key={item.id}
                                    className="flex justify-between items-center group"
                                >
                                    <div className="flex gap-4 items-center">
                                        <div className="w-12 h-12 rounded-xl overflow-hidden bg-white/10 p-1">
                                            <Image
                                                src={item.imageUrl}
                                                className="w-full h-full object-cover rounded-lg"
                                                width={48}
                                                height={48}
                                                priority
                                                alt={item.name}
                                            />
                                        </div>
                                        <div>
                                            <p className="font-bold text-stone-200 group-hover:text-white transition-colors">
                                                {item.name}
                                            </p>
                                            <p className="text-xs text-stone-400">
                                                {item.quantity} units
                                            </p>
                                        </div>
                                    </div>
                                    <span className="font-black text-[#D4A373]">
                    ${(parseFloat(item.price) * item.quantity).toFixed(2)}
                  </span>
                                </div>
                            ))}
                        </div>

                        <div className="border-t border-white/10 pt-8 space-y-4 mb-10">
                            <div className="flex justify-between text-stone-400 font-medium">
                                <span>Subtotal</span>
                                <span>${totalAmount.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-stone-400 font-medium">
                                <span>Delivery</span>
                                <span>$0.00</span>
                            </div>
                            <div className="flex justify-between font-black text-3xl pt-4">
                                <span>Total</span>
                                <span className="text-[#D4A373]">
                                    ${totalAmount.toFixed(2)}
                                </span>
                            </div>
                        </div>
                        <Button
                            variant={"secondary"}
                            onClick={goNext}
                            className="w-full bg-emerald-600 text-white py-6 rounded-full text-base md:text-lg hover:bg-emerald-700 transition-all transform active:scale-95"
                        >
                            Confirm Order
                        </Button>
                    </div>
                </div>
            </main>
            <Footer/>
        </div>
    );
};

export default Checkout;
