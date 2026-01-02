'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Plus, Star, Heart } from 'lucide-react';

interface ProductProps {
    product: {
        id: string;
        name: string;
        price: number;
        category: string;
        image: string;
        rating: number;
        isPopular: boolean;
    };
}

export const ProductCard = ({ product }: ProductProps) => {
    return (
        <motion.div
            whileHover={{ y: -5 }}
            className="group relative bg-white dark:bg-slate-900/50 rounded-3xl p-4 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-300"
        >
            {/* Popular Tag */}
            {product.isPopular && (
                <div className="absolute top-4 left-4 z-10 px-2.5 py-1 rounded-full bg-brand-accent/20 text-brand-secondary text-[10px] font-bold uppercase tracking-wider">
                    Popular
                </div>
            )}

            {/* Wishlist Button */}
            <button className="absolute top-4 right-4 z-10 p-2 rounded-full glass opacity-0 group-hover:opacity-100 transition-opacity">
                <Heart className="w-4 h-4 text-slate-400 hover:text-red-500 hover:fill-red-500 transition-colors" />
            </button>

            {/* Image Container */}
            <div className="relative aspect-square mb-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 overflow-hidden flex items-center justify-center p-6">
                <div className="w-full h-full bg-brand-primary/5 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                    {/* Fallback icon for missing images */}
                    <div className="w-20 h-20 rounded-full bg-brand-primary/10 flex items-center justify-center text-3xl">
                        {product.category === 'Electronics' ? '📱' :
                            product.category === 'Fashion' ? '👕' :
                                product.category === 'Home & Living' ? '🏠' :
                                    product.category === 'Snacks & Drinks' ? '🥤' :
                                        product.category === 'Beauty' ? '✨' : '📦'}
                    </div>
                </div>
            </div>

            {/* Content */}
            <div>
                <div className="flex items-center gap-1 text-brand-accent mb-1">
                    <Star className="w-3 h-3 fill-brand-accent" />
                    <span className="text-[10px] font-bold text-slate-900 dark:text-white">{product.rating}</span>
                    <span className="text-[10px] text-slate-400 font-medium">({Math.floor(Math.random() * 50) + 10})</span>
                </div>
                <div className="text-[10px] font-bold text-brand-secondary uppercase tracking-widest mb-1">
                    {product.category}
                </div>
                <h3 className="font-bold text-slate-900 dark:text-white text-sm mb-4 line-clamp-1">
                    {product.name}
                </h3>

                <div className="flex items-center justify-between">
                    <div className="text-lg font-black text-slate-900 dark:text-white">
                        RS {product.price.toFixed(2)}
                    </div>
                    <button className="p-2.5 rounded-xl primary-gradient text-white shadow-lg shadow-brand-primary/20 hover:scale-110 transition-transform active:scale-95">
                        <Plus className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </motion.div>
    );
};
