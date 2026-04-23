'use client';
import React, { useState, useEffect } from 'react';
import { useCartStore } from '@/store/cartStore';
import { Navbar } from '@/components/Navbar';
import dynamic from 'next/dynamic';
import { submitOrder } from './actions';
import { ArrowLeft, MapPin, CheckCircle2, Loader2, Navigation } from 'lucide-react';
import Link from 'next/link';

const LocationMap = dynamic(() => import('@/components/LocationMap'), {
    ssr: false,
    loading: () => <div className="h-[300px] w-full bg-slate-100 dark:bg-slate-800 animate-pulse rounded-[1.25rem] flex items-center justify-center font-bold text-slate-400">Loading Map...</div>
});

export default function CheckoutPage() {
    const { items, getTotal, shopId, clearCart, shopName } = useCartStore();
    const [mounted, setMounted] = useState(false);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const [formData, setFormData] = useState({
        customerName: '',
        customerEmail: '',
        customerPhone: '',
        address: ''
    });

    const [location, setLocation] = useState<{ lat: number, lng: number } | null>(null);

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!shopId || items.length === 0) {
            alert("Your cart is empty!");
            return;
        }

        setIsSubmitting(true);

        const res = await submitOrder({
            customerName: formData.customerName,
            customerEmail: formData.customerEmail,
            customerPhone: formData.customerPhone,
            address: formData.address,
            lat: location?.lat,
            lng: location?.lng,
            totalAmount: getTotal(),
            shopId: shopId,
            items: items.map(item => ({
                productId: item.id,
                quantity: item.quantity,
                price: item.price
            }))
        });

        setIsSubmitting(false);

        if (res.success) {
            setIsSuccess(true);
            clearCart();
        } else {
            alert(res.error);
        }
    };

    if (!mounted) return null;

    if (isSuccess) {
        return (
            <main className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-4">
                <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-10 rounded-[3rem] shadow-xl max-w-md w-full text-center">
                    <div className="w-24 h-24 bg-green-100 dark:bg-green-900/30 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                        <CheckCircle2 className="w-12 h-12" />
                    </div>
                    <h1 className="text-3xl font-black text-slate-800 dark:text-white mb-2">Order Confirmed!</h1>
                    <p className="text-slate-500 font-medium mb-8">
                        Your order has been sent to the restaurant. They will start preparing it shortly.
                    </p>
                    <Link href="/" className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 px-8 rounded-full shadow-lg shadow-orange-500/20 transition-all inline-block w-full">
                        Back to Home
                    </Link>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-[#FDFEFE] dark:bg-slate-950 pb-20">
            <Navbar />

            <div className="pt-28 container mx-auto px-4 md:px-6 max-w-5xl">
                <Link href="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-800 dark:hover:text-white font-bold mb-8 transition-colors">
                    <ArrowLeft className="w-5 h-5" />
                    Back to shopping
                </Link>

                <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-10">Checkout</h1>

                {items.length === 0 ? (
                    <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-12 text-center border border-slate-100 dark:border-slate-800">
                        <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
                        <Link href="/" className="text-orange-500 font-bold hover:underline">Start an order</Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                        <div className="lg:col-span-2 space-y-8">

                            {/* Form Section */}
                            <form id="checkout-form" onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 md:p-10 shadow-sm border border-slate-100 dark:border-slate-800 space-y-6">
                                <h2 className="text-2xl font-black text-slate-800 dark:text-white flex items-center gap-2 mb-2">
                                    <MapPin className="w-6 h-6 text-orange-500" />
                                    Delivery Details
                                </h2>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Full Name</label>
                                        <input required name="customerName" value={formData.customerName} onChange={handleChange} type="text" className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl px-5 py-4 focus:ring-2 focus:ring-orange-500 outline-none transition-all font-medium" placeholder="John Doe" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Phone Number</label>
                                        <input required name="customerPhone" value={formData.customerPhone} onChange={handleChange} type="tel" className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl px-5 py-4 focus:ring-2 focus:ring-orange-500 outline-none transition-all font-medium" placeholder="+1 (555) 000-0000" />
                                    </div>
                                    <div className="space-y-2 md:col-span-2">
                                        <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Email Address</label>
                                        <input required name="customerEmail" value={formData.customerEmail} onChange={handleChange} type="email" className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl px-5 py-4 focus:ring-2 focus:ring-orange-500 outline-none transition-all font-medium" placeholder="john@example.com" />
                                    </div>
                                </div>

                                <hr className="border-slate-100 dark:border-slate-800 my-8" />

                                <h3 className="text-lg font-black text-slate-800 dark:text-white flex items-center gap-2 mb-4">
                                    <Navigation className="w-5 h-5 text-orange-500" />
                                    Pin exact location
                                </h3>
                                <p className="text-sm text-slate-500 font-medium mb-4">Move the map and tap to drop a pin on your exact building entrance.</p>

                                <LocationMap onLocationSelect={(lat, lng) => setLocation({ lat, lng })} />

                                <div className="space-y-2 mt-6">
                                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Manual Address / Apartment Number</label>
                                    <textarea required name="address" value={formData.address} onChange={handleChange} rows={3} className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl px-5 py-4 focus:ring-2 focus:ring-orange-500 outline-none transition-all font-medium resize-none" placeholder="Apt 4B, Building 12, Main Street..."></textarea>
                                </div>
                            </form>
                        </div>

                        {/* Order Summary */}
                        <div className="lg:col-span-1">
                            <div className="bg-slate-900 text-white rounded-[2.5rem] p-8 sticky top-28 shadow-xl">
                                <h3 className="text-xl font-black mb-6">Order Summary</h3>
                                <div className="text-sm font-bold text-orange-400 bg-orange-500/10 px-4 py-2 rounded-xl inline-block mb-6">
                                    From: {shopName}
                                </div>

                                <div className="space-y-4 mb-8 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
                                    {items.map(item => (
                                        <div key={item.id} className="flex justify-between gap-4">
                                            <div className="flex gap-3">
                                                <div className="bg-slate-800 text-orange-400 font-black px-2 py-1 rounded-lg h-fit text-sm">
                                                    {item.quantity}x
                                                </div>
                                                <div className="font-medium text-slate-300">
                                                    {item.name}
                                                </div>
                                            </div>
                                            <div className="font-bold shrink-0">
                                                ${(item.price * item.quantity).toFixed(2)}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <hr className="border-slate-800 mb-6" />

                                <div className="flex justify-between items-center mb-8">
                                    <span className="text-slate-400 font-medium">Total</span>
                                    <span className="text-3xl font-black">${getTotal().toFixed(2)}</span>
                                </div>

                                <button
                                    type="submit"
                                    form="checkout-form"
                                    disabled={isSubmitting || !location}
                                    className={`w-full font-black py-4 rounded-full transition-all flex justify-center items-center gap-2 ${(!location || isSubmitting) ? 'bg-slate-800 text-slate-500 cursor-not-allowed' : 'bg-orange-500 hover:bg-orange-400 text-white shadow-lg shadow-orange-500/20'}`}
                                >
                                    {isSubmitting ? (
                                        <><Loader2 className="w-5 h-5 animate-spin" /> Placing Order...</>
                                    ) : !location ? (
                                        "Please Drop a Pin"
                                    ) : (
                                        "Confirm & Pay"
                                    )}
                                </button>
                                {!location && <p className="text-xs text-center text-red-400 mt-4 font-medium">You must drop a pin on the map to proceed.</p>}
                            </div>
                        </div>

                    </div>
                )}
            </div>
        </main>
    );
}
