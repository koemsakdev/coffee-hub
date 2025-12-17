"use client";

import React, { useState } from 'react';
import { Truck, CreditCard, Wallet, Check, Loader2, Icon as LucideIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

// =================================================================================
// 1. INTERFACES
// =================================================================================

interface ShippingDetails {
    fullName: string;
    address: string;
    city: string;
    postalCode: string;
    email: string;
    state: string;
}

interface InputProps {
    label: string;
    name: keyof ShippingDetails | string;
    value: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    type?: string;
    required?: boolean;
    readOnly?: boolean;
    className?: string;
}

interface ButtonProps {
    children: React.ReactNode;
    disabled?: boolean;
    type?: 'button' | 'submit' | 'reset';
    onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
    loading?: boolean;
    className?: string;
    variant?: 'default' | 'outline' | 'ghost'; // Shadcn variants
}

interface PaymentOptionProps {
    id: string;
    label: string;
    icon: React.ElementType;
    description: string;
}

// =================================================================================
// 2. SHADCN-STYLE COMPONENTS
// =================================================================================

/**
 * Shadcn-style Button component
 */
const Button: React.FC<ButtonProps> = ({
    children,
    disabled,
    type = 'button',
    onClick,
    loading = false,
    className = '',
    variant = 'default',
}) => {
    let baseClasses = 'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2';

    if (variant === 'default') {
        // Primary/Default style (indigo)
        baseClasses += ' bg-indigo-600 text-white hover:bg-indigo-700 active:bg-indigo-800 shadow-md';
    } else if (variant === 'outline') {
        baseClasses += ' border border-input bg-background hover:bg-accent hover:text-accent-foreground';
    } else if (variant === 'ghost') {
        baseClasses += ' hover:bg-accent hover:text-accent-foreground';
    }

    return (
        <button
            type={type}
            disabled={disabled || loading}
            onClick={onClick}
            className={`${baseClasses} ${className}`}
        >
            {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
            {children}
        </button>
    );
};

/**
 * Shadcn-style Input component combined with Label
 */
// const Input: React.FC<InputProps> = ({ 
//   label, 
//   name, 
//   value, 
//   type = 'text', 
//   readOnly = false, 
//   onChange, 
//   required = false, 
//   className = '' 
// }) => (
//   <div className="grid w-full items-center gap-1.5 mb-4">
//     <label htmlFor={name} className="text-sm font-medium leading-none text-gray-700">
//       {label} {required && <span className="text-red-500">*</span>}
//     </label>
//     <input
//       type={type}
//       name={name}
//       id={name}
//       value={value}
//       onChange={onChange}
//       readOnly={readOnly}
//       required={required}
//       // Shadcn input classes: border-input, bg-background, focus-visible:ring-ring
//       className={`flex h-10 w-full rounded-md border px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition duration-150
//           ${readOnly ? 'bg-gray-100 border-gray-200 cursor-default disabled' : 'bg-white border-gray-300'} 
//           ${className}`}
//     />
//   </div>
// );

/**
 * Shadcn-style RadioGroup Item for Payment Options
 */
const PaymentOption: React.FC<PaymentOptionProps & {
    paymentMethod: string;
    setPaymentMethod: (method: string) => void;
}> = ({ id, label, icon: Icon, description, paymentMethod, setPaymentMethod }) => (
    <label
        htmlFor={id}
        className={`relative flex cursor-pointer items-center justify-between rounded-lg border p-4 shadow-sm transition duration-150 ease-in-out hover:bg-gray-50
      ${paymentMethod === id
                ? 'border-indigo-600 ring-2 ring-indigo-600 bg-indigo-50/50'
                : 'border-gray-200'
            }`
        }
    >
        <div className="flex items-center">
            {/* Custom Radio Circle to mimic shadcn RadioItem */}
            <div
                className={`h-4 w-4 rounded-full border border-gray-400 mr-4 flex items-center justify-center transition ${paymentMethod === id ? 'border-indigo-600 bg-white' : 'bg-white'}`}
                role="radio"
                aria-checked={paymentMethod === id}
            >
                <span className={`h-2 w-2 rounded-full bg-indigo-600 transition duration-150 ${paymentMethod === id ? 'opacity-100' : 'opacity-0'}`}></span>
            </div>

            <input
                type="radio"
                name="paymentMethod"
                id={id}
                value={id}
                checked={paymentMethod === id}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="sr-only"
                aria-labelledby={`${id}-label`}
                aria-describedby={`${id}-description`}
            />
            <div className="flex flex-1 items-center">
                <Icon className="h-5 w-5 text-gray-600 mr-3" />
                <div className="flex flex-col">
                    <span id={`${id}-label`} className="block text-sm font-medium text-gray-900">
                        {label}
                    </span>
                    <span id={`${id}-description`} className="mt-1 flex items-center text-xs text-gray-500">
                        {description}
                    </span>
                </div>
            </div>
        </div>
    </label>
);

// =================================================================================
// 3. MAIN APP COMPONENT
// =================================================================================

const App: React.FC = () => {
    const initialShippingDetails: ShippingDetails = {
        fullName: 'John Smith',
        address: '123 Main Street',
        city: 'San Francisco',
        postalCode: '94107',
        email: 'john.smith@example.com',
        state: 'California',
    };

    const [shippingDetails, setShippingDetails] = useState<ShippingDetails>(initialShippingDetails);
    const [paymentMethod, setPaymentMethod] = useState<string>('credit_card');
    const [isProcessing, setIsProcessing] = useState<boolean>(false);
    const [view, setView] = useState<'checkout' | 'success'>('checkout');

    // Mock order details
    const subtotal: number = 149.99;
    const shippingCost: number = 10.00;
    const taxRate: number = 0.08;
    const tax: number = subtotal * taxRate;
    const total: number = subtotal + shippingCost + tax;

    // Typed change event handler for mutable shipping inputs
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setShippingDetails(prev => ({ ...prev, [name]: value } as ShippingDetails));
    };

    // Typed form submission handler
    const handlePaymentSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!shippingDetails.fullName || !shippingDetails.address || !shippingDetails.email) {
            console.error('Validation Error: Please fill out all required shipping fields.');
            return;
        }

        setIsProcessing(true);
        // Simulate API call delay
        setTimeout(() => {
            setIsProcessing(false);
            setView('success');
            console.log("Payment Processed for:", total.toFixed(2), "via", paymentMethod);
        }, 2000);
    };

    if (view === 'success') {
        return (
            <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
                <div className="max-w-md w-full p-8 bg-white shadow-2xl rounded-xl text-center border-t-4 border-indigo-500">
                    <div className="flex justify-center mb-6">
                        <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center">
                            <Check className="h-8 w-8 text-green-600" />
                        </div>
                    </div>
                    <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Order Confirmed!</h1>
                    <p className="text-gray-600 mb-6">
                        Thank you for your purchase. Your order has been placed successfully and a confirmation email has been sent to {shippingDetails.email}.
                    </p>
                    <div className="space-y-3 bg-gray-50 p-4 rounded-lg text-left text-sm">
                        <div className="flex justify-between font-medium">
                            <span>Order Total:</span>
                            <span>${total.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-gray-700">
                            <span>Ship to:</span>
                            <span>{shippingDetails.fullName}</span>
                        </div>
                    </div>
                    <Button
                        onClick={() => setView('checkout')}
                        className="mt-6 w-full"
                    >
                        Continue Shopping
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-10">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-4xl font-extrabold text-gray-900 mb-8 text-center sm:text-left">Checkout</h1>
                <form onSubmit={handlePaymentSubmit}>
                    <div className="grid grid-cols-1 lg:grid-cols-3 lg:gap-10">

                        {/* Left Column: Shipping and Payment */}
                        <div className="lg:col-span-2 space-y-8">

                            {/* Shipping Information Section */}
                            <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg border border-gray-100">
                                <div className="flex items-center space-x-3 mb-6 border-b pb-4">
                                    <Truck className="h-6 w-6 text-indigo-500" />
                                    <h2 className="text-2xl font-semibold text-gray-900">Shipping Information</h2>
                                </div>
                                <div className='flex flex-col gap-4'>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
                                        <div className='flex flex-col gap-2'>
                                            <Label>Full Name</Label>
                                            <Input
                                                name="fullName"
                                                value={shippingDetails.fullName}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </div>
                                        <div className='flex flex-col gap-2'>
                                            <Label>Email</Label>
                                            <Input
                                                name="email"
                                                type="email"
                                                value={shippingDetails.email}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className='flex flex-col gap-2'>
                                        <Label>Address</Label>
                                        <Input
                                            name="address"
                                            value={shippingDetails.address}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-6">
                                        <div className="flex flex-col gap-2">
                                            <Label>City</Label>
                                            <Input
                                                name="city"
                                                value={shippingDetails.city}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <Label>State</Label>
                                            <Input
                                                name="state"
                                                value={shippingDetails.state}
                                                onChange={handleInputChange}
                                            />
                                        </div>

                                        <div className="flex flex-col gap-2">
                                            <Label>Postal Code</Label>
                                            <Input
                                                name="postalCode"
                                                value={shippingDetails.postalCode}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Payment Method Section */}
                            <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg border border-gray-100">
                                <div className="flex items-center space-x-3 mb-6 border-b pb-4">
                                    <CreditCard className="h-6 w-6 text-indigo-500" />
                                    <h2 className="text-2xl font-semibold text-gray-900">Payment Method</h2>
                                </div>

                                {/* Payment Options using shadcn-style Radio Items */}
                                <div className="space-y-4">
                                    <PaymentOption
                                        id="credit_card"
                                        label="Credit or Debit Card"
                                        icon={CreditCard}
                                        description="Visa, MasterCard, American Express"
                                        paymentMethod={paymentMethod}
                                        setPaymentMethod={setPaymentMethod}
                                    />
                                    <PaymentOption
                                        id="paypal"
                                        label="Pay with PayPal"
                                        icon={Wallet}
                                        description="Pay easily and securely"
                                        paymentMethod={paymentMethod}
                                        setPaymentMethod={setPaymentMethod}
                                    />
                                </div>

                                {/* Mock Card Input if Credit Card is selected */}
                                {paymentMethod === 'credit_card' && (
                                    <div className="mt-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
                                        <div >

                                        </div>
                                        <Input name="cardNumber" value="4111 **** **** 1234" readOnly />
                                        <div className="grid grid-cols-3 gap-4">
                                            <div className='flex flex-col gap-2'>
                                                <Label>Card Name</Label>
                                                <Input name="cardName" value="J. Smith" readOnly />
                                            </div>
                                            <div className="flex flex-col gap-2">
                                                <Label>Expiry</Label>
                                                <Input name="expiry" value="12/26" readOnly />
                                            </div>
                                            <div className='flex flex-col gap-2'>
                                                <Label>CVC</Label>
                                                <Input name="cvc" value="123" type="password" readOnly />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Right Column: Order Summary */}
                        <div className="lg:col-span-1 mt-8 lg:mt-0">
                            <div className="sticky top-10 bg-white p-6 sm:p-8 rounded-xl shadow-2xl border border-gray-100">
                                <h2 className="text-2xl font-semibold text-gray-900 mb-6 border-b pb-4">Order Summary</h2>

                                {/* Price Breakdown */}
                                <div className="space-y-4 text-gray-700">
                                    <div className="flex justify-between">
                                        <span>Subtotal</span>
                                        <span>${subtotal.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Shipping</span>
                                        <span>${shippingCost.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between border-b pb-4">
                                        <span>Tax ({(taxRate * 100).toFixed(0)}%)</span>
                                        <span>${tax.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-xl font-bold text-gray-900 pt-2">
                                        <span>Order Total</span>
                                        <span>${total.toFixed(2)}</span>
                                    </div>
                                </div>

                                <div className="mt-8">
                                    {/* Using the new Button component */}
                                    <Button
                                        type="submit"
                                        loading={isProcessing}
                                        disabled={isProcessing}
                                        className="w-full h-12 text-base"
                                    >
                                        Pay Now ${total.toFixed(2)}
                                    </Button>
                                </div>

                                <p className="mt-4 text-xs text-center text-gray-500">
                                    By clicking "Pay Now", you agree to our Terms & Conditions.
                                </p>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default App;