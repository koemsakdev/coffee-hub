"use client";

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from '@/components/ui/button'
import { ChevronDownIcon } from 'lucide-react'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input";
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "@/components/ui/input-group";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { useRouter } from "next/navigation";
import NavigationBar from "@/components/navbar";
import { useState, useTransition } from "react";
import { Spinner } from "@/components/ui/spinner";

const formSchema = z.object({
    transaction_id: z.string().min(1, "Transaction ID must be at least 1 characters."),
    client_reference: z.string().min(1, "Client Reference must be at least 1 characters."),
    amount: z.string().min(1, "Amount must be at least 1 characters."),
    currency: z.enum(["USD", "KHR"])
})


const SettlementPage = () => {
    const router = useRouter();
    const [isPaymentPending, startPaymentTransition] = useTransition();
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            transaction_id: "",
            client_reference: "",
            amount: "",
            currency: "USD",
        },
    })



    function onSubmit(values: z.infer<typeof formSchema>) {
        startPaymentTransition(async () => {
            const resp = await fetch("/api/v1/payment/settle", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(values),
            });

            if (!resp.ok) {
                throw new Error(await resp.text());
            }

            const data = await resp.json();
            if (data.status !== 200) return;
            router.push(`/success-settle?token=${base64Encode(data.data)}`);
        });
    }



    function handleCancel() {
        form.reset();
        router.push("/");
    }

    const base64Encode = (value: unknown) => {
        return btoa(JSON.stringify(value));
    };
    return (
        <div className="flex flex-col min-h-screen">
            <NavigationBar />
            <main className="w-full max-w-4xl mx-auto px-10 py-10 mt-20 shadow-sm rounded-sm bg-white">
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                    Settle Your Balance
                </h1><p className="mt-2 text-sm text-slate-600 leading-relaxed">
                    Review your final outstanding amount below. Once confirmed, select a payment method to securely finalize your settlement.
                </p>
                <Separator className="my-4" />
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="transaction_id"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Transaction ID</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="text"
                                            disabled={isPaymentPending}
                                            {...field}
                                            placeholder="7667138380886153104505"
                                            className="px-3 py-6 bg-stone-50 border-0 rounded-md focus-visible:ring-3 focus-visible:ring-stone-300 outline-none shadow-none"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="client_reference"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Client Reference</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="text"
                                            disabled={isPaymentPending}
                                            {...field}
                                            placeholder="69010569-893d-432a-a79d-6dec12c16453"
                                            className="px-3 py-6 bg-stone-50 border-0 rounded-md focus-visible:ring-3 focus-visible:ring-stone-300 outline-none shadow-none"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="amount"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Amount</FormLabel>
                                    <FormControl>
                                        <InputGroup className="py-6 bg-stone-50 border-0 rounded-md focus-visible:ring-2! focus-visible:ring-stone-100! outline-none shadow-none">
                                            <InputGroupInput disabled={isPaymentPending} type="number" {...field} placeholder="Enter amount" className="focus-visible:ring-0" />
                                            <InputGroupAddon align="inline-end">
                                                <FormField
                                                    disabled={isPaymentPending}
                                                    control={form.control}
                                                    name="currency"
                                                    render={({ field: currencyField }) => (
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger asChild>
                                                                <InputGroupButton
                                                                    variant="ghost"
                                                                    className="pr-1.5! text-xs"
                                                                    disabled={isPaymentPending}
                                                                >
                                                                    {currencyField.value}
                                                                    <ChevronDownIcon className="size-3 ml-1" />
                                                                </InputGroupButton>
                                                            </DropdownMenuTrigger>

                                                            <DropdownMenuContent
                                                                align="end"
                                                                className="[--radius:0.95rem]"
                                                            >
                                                                {["USD", "KHR"].map((currency) => (
                                                                    <DropdownMenuItem
                                                                        key={currency}
                                                                        onClick={() => currencyField.onChange(currency)}
                                                                    >
                                                                        {currency}
                                                                    </DropdownMenuItem>
                                                                ))}
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    )}
                                                />
                                            </InputGroupAddon>
                                        </InputGroup>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="grid grid-cols-1 gap-2">
                            <Button type="submit" disabled={isPaymentPending} className="w-full bg-blue-100 hover:bg-blue-200 text-blue-500 hover:text-blue-600 py-6 rounded-md">
                                {isPaymentPending ? <div className="flex items-center justify-center gap-2">
                                    <Spinner className="w-5 h-5 text-blue-600 inline-block" />Processing...
                                </div> : "Settle Now"}
                            </Button>
                            <Button type="button" disabled={isPaymentPending} onClick={handleCancel} className="w-full bg-red-100 hover:bg-red-200 text-red-500 hover:text-red-600 py-6 rounded-md">Cancel</Button>
                        </div>
                    </form>
                </Form>
            </main>
        </div>
    )
}

export default SettlementPage