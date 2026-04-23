'use client';
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCartStore } from '@/store/cartStore';
import { X, Minus, Plus, ShoppingBag, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export function CartDrawer() {
    const { items, updateQuantity, removeItem, getTotal, shopName, isDrawerOpen, closeDrawer } = useCartStore();
    const [mounted, setMounted] = useState(false);

    // Prevent hydration mismatch
    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <AnimatePresence>
            {isDrawerOpen && (
                <motion.div
                    key="backdrop"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50"
                    onClick={closeDrawer}
                />
            )}
            {isDrawerOpen && (
                <motion.div
                    key="drawer"
                    initial={{ x: '100%' }}
                    animate={{ x: 0 }}
                    exit={{ x: '100%' }}
                    transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
                    className="fixed right-0 top-0 h-full w-full max-w-md bg-white dark:bg-slate-950 shadow-2xl z-[60] flex flex-col border-l border-slate-100 dark:border-slate-800"
                >
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800">
                        <h2 className="text-2xl font-black flex items-center gap-2 text-slate-800 dark:text-white">
                            <ShoppingBag className="w-6 h-6 text-orange-500" />
                            Your Order
                        </h2>
                        <button onClick={closeDrawer} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
                            <X className="w-6 h-6 text-slate-500" />
                        </button>
                    </div>

                    {/* Cart Items */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-6">
                        {items.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-4">
                                <ShoppingBag className="w-16 h-16 opacity-20" />
                                <p className="font-bold text-lg">Your cart is empty.</p>
                            </div>
                        ) : (
                            <>
                                <div className="text-sm font-bold text-orange-500 bg-orange-50 dark:bg-orange-500/10 px-4 py-2 rounded-xl inline-block mb-2">
                                    Ordering from: {shopName}
                                </div>
                                <div className="space-y-6">
                                    {items.map(item => (
                                        <div key={item.id} className="flex gap-4">
                                            <img src={item.image} alt={item.name} className="w-20 h-20 rounded-2xl object-cover bg-slate-100" />
                                            <div className="flex-1 flex flex-col justify-between">
                                                <div>
                                                    <h3 className="font-bold text-slate-800 dark:text-white line-clamp-1">{item.name}</h3>
                                                    <p className="text-orange-500 font-black">${item.price.toFixed(2)}</p>
                                                </div>
                                                <div className="flex items-center justify-between mt-2">
                                                    <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-900 rounded-full p-1 border border-slate-100 dark:border-slate-800">
                                                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-1 hover:bg-white dark:hover:bg-slate-800 rounded-full shadow-sm transition-colors text-slate-600 dark:text-slate-400">
                                                            <Minus className="w-4 h-4" />
                                                        </button>
                                                        <span className="font-bold text-sm w-4 text-center dark:text-white">{item.quantity}</span>
                                                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-1 hover:bg-white dark:hover:bg-slate-800 rounded-full shadow-sm transition-colors text-slate-600 dark:text-slate-400">
                                                            <Plus className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                    <button onClick={() => removeItem(item.id)} className="text-xs font-bold text-red-500 hover:text-red-600 uppercase tracking-wider">
                                                        Remove
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>

                    {/* Footer */}
                    {items.length > 0 && (
                        <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                            <div className="flex justify-between items-center mb-6">
                                <span className="text-slate-500 font-bold">Total Amount</span>
                                <span className="text-3xl font-black text-slate-800 dark:text-white">${getTotal().toFixed(2)}</span>
                            </div>
                            <Link onClick={closeDrawer} href="/checkout" className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 rounded-[1.25rem] flex items-center justify-center gap-2 shadow-lg hover:shadow-xl shadow-orange-500/30 transition-all hover:-translate-y-1">
                                Proceed to Checkout
                                <ArrowRight className="w-5 h-5" />
                            </Link>
                        </div>
                    )}
                </motion.div>
            )}
        </AnimatePresence>
    );
}
