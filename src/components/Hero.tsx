'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, Star, ArrowRight, Play, Search, ShoppingCart, Plus, Heart, ChevronRight, Leaf, Clock } from 'lucide-react';

export const Hero = () => {
    return (
        <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
            {/* Background Decorative Elements */}
            <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-brand-primary/10 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute bottom-[10%] left-[-10%] w-[30%] h-[30%] bg-brand-secondary/10 blur-[100px] rounded-full pointer-events-none" />

            <div className="container mx-auto px-4 md:px-6 relative">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-primary/10 text-brand-secondary text-sm font-semibold mb-6">
                            <Star className="w-4 h-4 fill-brand-primary" />
                            <span>Your Premium Everything Store</span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-bold leading-[1.1] mb-6">
                            Everything You <br />
                            <span className="text-gradient">Need in One Place</span>
                        </h1>
                        <p className="text-lg text-slate-600 dark:text-slate-400 mb-8 max-w-lg">
                            Discover a curated collection of electronics, fashion, home essentials, and more. Quality products from your favorite brands, delivered to your doorstep.
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <button className="primary-gradient text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-2 shadow-lg shadow-brand-primary/30 hover:scale-105 transition-transform">
                                <ShoppingBag className="w-5 h-5" />
                                Shop Essentials
                            </button>
                            <button className="text-slate-600 dark:text-slate-400 font-bold px-4 py-4 hover:underline">
                                View Catalog ↓
                            </button>
                        </div>

                        {/* Stats */}
                        <div className="flex gap-12 mt-12 pt-12 border-t border-slate-100 dark:border-slate-800">
                            <div>
                                <div className="text-3xl font-black text-slate-900 dark:text-white mb-1">500+</div>
                                <div className="text-sm text-slate-500 uppercase tracking-wider font-bold">Products</div>
                            </div>
                            <div>
                                <div className="text-3xl font-black text-slate-900 dark:text-white mb-1">100%</div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Hero Image Mockup */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="relative"
                    >
                        <div className="aspect-square rounded-[3rem] bg-gradient-to-br from-mint-100 to-mint-50 overflow-hidden shadow-2xl relative border-8 border-white dark:border-slate-800">
                            <div className="flex items-center justify-center h-full">
                                <div className="grid grid-cols-2 gap-4 p-8">
                                    <div className="w-full aspect-square bg-white rounded-3xl shadow-lg animate-pulse" />
                                    <div className="w-full aspect-square bg-mint-400 rounded-3xl shadow-lg mt-8" />
                                    <div className="w-full aspect-square bg-mint-600 rounded-3xl shadow-lg -mt-8" />
                                    <div className="w-full aspect-square bg-slate-200 rounded-3xl shadow-lg" />
                                </div>
                            </div>
                            <div className="absolute top-10 right-10 glass p-4 rounded-2xl shadow-glass animate-bounce">
                                <span className="text-xs font-bold text-mint-600 uppercase tracking-widest">Organic Apple</span>
                                <div className="text-2xl font-black">RS 4.99</div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div >
        </section >
    );
};
