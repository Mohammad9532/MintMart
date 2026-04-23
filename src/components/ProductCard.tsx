'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Plus, Star, Heart } from 'lucide-react';
import { Product } from '@/data/mock-data';
import { useCartStore } from '@/store/cartStore';

interface ProductProps {
    product: Product & { shopName?: string };
}

export const ProductCard = ({ product }: ProductProps) => {
    // Safely cast to access our dynamic db field
    const isAvailable = (product as any).isAvailable ?? true;
    const { addItem } = useCartStore();

    const handleAddToCart = () => {
        const res = addItem({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            shopId: (product as any).shopId,
            shopName: (product as any).shopName || "Restaurant"
        });
        if (!res.success && res.message) {
            alert(res.message);
        }
    };

    return (
        <div
            id={`product-${product.id}`}
            className={`group relative bg-[#FDFEFE] dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 ${!isAvailable ? 'opacity-60 grayscale-[0.6]' : ''}`}
        >
            {/* Popular Tag */}
            {product.isPopular && (
                <div className="absolute top-6 left-6 z-10 px-2.5 py-1 rounded-full bg-orange-500/90 backdrop-blur-sm text-white text-[10px] font-bold uppercase tracking-wider shadow-sm">
                    Popular
                </div>
            )}

            {/* Wishlist Button */}
            <button className="absolute top-6 right-6 z-10 p-2 rounded-full bg-white/80 dark:bg-slate-800/80 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity border border-slate-100 dark:border-slate-700 shadow-sm">
                <Heart className="w-4 h-4 text-slate-400 hover:text-red-500 hover:fill-red-500 transition-colors" />
            </button>

            {/* Image Container */}
            <div className="relative aspect-square mb-4 rounded-3xl bg-slate-50 dark:bg-slate-800/50 overflow-hidden flex items-center justify-center p-2 isolate">
                <div className="w-full h-full bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center group-hover:scale-105 transition-transform duration-500 overflow-hidden relative">
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover mix-blend-multiply dark:mix-blend-normal" />
                    {!isAvailable && (
                        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center z-20">
                            <span className="bg-red-500 text-white font-black px-4 py-2 rounded-xl text-sm uppercase tracking-wider shadow-xl transform -rotate-12 outline outline-4 outline-white/20">Sold Out</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Content */}
            <div className="px-2 pb-2">
                <div className="flex items-center gap-1 text-orange-500 mb-1.5">
                    <Star className="w-3.5 h-3.5 fill-orange-500" />
                    <span className="text-xs font-bold text-slate-900 dark:text-white">{(product as any).rating || 4.5}</span>
                    <span className="text-xs text-slate-400 font-medium">({Math.floor(Math.random() * 50) + 10})</span>
                </div>
                <div className="text-[10px] font-bold text-orange-600 bg-orange-50 dark:bg-orange-500/10 px-2 py-0.5 rounded-lg inline-block uppercase tracking-wider mb-2">
                    {product.category}
                </div>
                <h3 className="font-bold text-slate-900 dark:text-white text-base mb-4 line-clamp-1">
                    {product.name}
                </h3>

                <div className="flex items-center justify-between">
                    <div className="text-xl font-black text-slate-900 dark:text-white flex items-end gap-1">
                        <span className="text-sm text-slate-500 font-bold mb-0.5">$</span>
                        {product.price.toFixed(2)}
                    </div>
                    <button
                        onClick={handleAddToCart}
                        disabled={!isAvailable}
                        className={`py-3 px-4 rounded-[1.25rem] shadow-sm transition-all flex justify-center items-center min-w-[110px] ${isAvailable ? 'bg-orange-50 dark:bg-slate-800 text-orange-600 hover:bg-orange-500 hover:text-white hover:shadow-lg hover:shadow-orange-500/20 active:scale-95' : 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed'}`}
                    >
                        {isAvailable ? <Plus className="w-5 h-5 font-bold" /> : <span className="text-xs uppercase tracking-wider font-black px-1">Sold Out</span>}
                    </button>
                </div>
            </div>
        </div>
    );
};
