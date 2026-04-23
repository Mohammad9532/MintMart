'use client';
import React, { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { ProductCard } from '@/components/ProductCard';
import { Star, Clock, MapPin, ChevronLeft, Info, HelpCircle } from 'lucide-react';
import Link from 'next/link';

export default function ShopClient({ shop, initialProducts }: { shop: any, initialProducts: any[] }) {
    const [searchQuery, setSearchQuery] = useState('');

    const displayProducts = initialProducts.filter((p: any) => p.name.toLowerCase().includes(searchQuery.toLowerCase()));

    const searchSuggestions = searchQuery ? displayProducts.slice(0, 5).map((p: any) => ({
        id: p.id,
        title: p.name,
        subtitle: `$${p.price.toFixed(2)}`,
        image: p.image,
        href: `#product-${p.id}`
    })) : [];

    return (
        <main className="min-h-screen bg-[#FDFEFE] dark:bg-slate-950 pb-20">
            <Navbar
                onSearch={setSearchQuery}
                searchQuery={searchQuery}
                searchPlaceholder="Search food items..."
                suggestions={searchSuggestions}
            />

            {/* Shop Header Banner */}
            <div className="pt-20">
                <div className="h-56 md:h-72 lg:h-[400px] w-full relative isolate overflow-hidden">
                    <img src={shop.image} alt={shop.name} className="absolute inset-0 w-full h-full object-cover z-0" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10 z-10" />

                    <div className="container mx-auto px-4 md:px-6 h-full relative z-20 flex flex-col justify-end pb-10">
                        <Link href="/" className="w-12 h-12 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center text-white mb-auto mt-6 transition-all border border-white/20 shadow-lg">
                            <ChevronLeft className="w-6 h-6 stroke-[3]" />
                        </Link>

                        <div className="flex flex-col md:flex-row md:items-end gap-6 justify-between mt-auto">
                            <div className="text-white">
                                <h1 className="text-4xl md:text-6xl font-black mb-3 tracking-tight">{shop.name}</h1>
                                <p className="text-white/90 font-bold text-lg md:text-xl flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-orange-400"></span>
                                    {shop.tags.join(' • ')}
                                </p>
                            </div>
                            <div className="flex flex-wrap items-center gap-3">
                                <div className="bg-white/95 backdrop-blur-md text-slate-800 px-5 py-3 rounded-[1.25rem] flex items-center gap-2 font-black shadow-xl">
                                    <Star className="w-5 h-5 text-orange-500 fill-orange-500" />
                                    <span className="text-lg">{shop.rating}</span>
                                </div>
                                <div className="bg-[#121212]/90 backdrop-blur-md text-white px-5 py-3 rounded-[1.25rem] flex items-center gap-2 font-black shadow-xl border border-white/10">
                                    <Clock className="w-5 h-5 text-orange-400" />
                                    <span className="text-lg">{shop.deliveryTime}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Shop Content */}
            <div className="container mx-auto px-4 md:px-6 mt-10 md:mt-16">
                <div className="flex flex-col lg:flex-row gap-10">
                    {/* Sidebar / Info */}
                    <div className="w-full lg:w-[320px] shrink-0">
                        <div className="bg-white dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800/50 p-8 rounded-[2.5rem] shadow-sm sticky top-28">
                            <h3 className="font-black text-xl mb-6 text-slate-800 dark:text-white flex items-center gap-2">
                                <Info className="w-6 h-6 text-orange-500" />
                                Store Info
                            </h3>
                            <div className="space-y-6 text-slate-600 dark:text-slate-400 text-sm font-medium">
                                <div className="flex gap-4 items-start">
                                    <div className="w-10 h-10 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center shrink-0">
                                        <MapPin className="w-5 h-5 text-orange-500" />
                                    </div>
                                    <p className="pt-1.5 leading-relaxed">123 Market Street, Delivery Zone A.<br /><span className="text-orange-500 font-bold">Free delivery available!</span></p>
                                </div>
                                <div className="flex gap-4 items-start">
                                    <div className="w-10 h-10 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center shrink-0">
                                        <Clock className="w-5 h-5 text-orange-500" />
                                    </div>
                                    <p className="pt-2 leading-relaxed">Open until 11:00 PM</p>
                                </div>
                                <div className="flex gap-4 items-start">
                                    <div className="w-10 h-10 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center shrink-0">
                                        <HelpCircle className="w-5 h-5 text-orange-500" />
                                    </div>
                                    <p className="pt-2 leading-relaxed">Need help? <a href="#" className="text-orange-500 font-bold hover:underline">Contact Support</a></p>
                                </div>
                            </div>

                            <hr className="my-8 border-slate-100 dark:border-slate-800/50" />

                            <h3 className="font-black text-lg mb-4 text-slate-800 dark:text-white">Store Tags</h3>
                            <div className="flex flex-wrap gap-2">
                                {shop.tags.map((tag: string) => (
                                    <span key={tag} className="bg-slate-50 border border-slate-100 dark:bg-slate-800 dark:border-slate-700 text-slate-600 dark:text-slate-300 px-4 py-2 rounded-xl text-sm font-bold">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Products Grid */}
                    <div className="w-full flex-1">
                        <div className="flex items-center justify-between mb-8 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2rem] p-4 shadow-sm w-full">
                            <h2 className="text-2xl font-black text-slate-800 dark:text-white ml-4">Items Catalogue</h2>
                            <div className="bg-slate-100 dark:bg-slate-800 px-4 py-2 rounded-xl text-slate-600 dark:text-slate-300 font-bold text-sm">
                                {displayProducts.length} items
                            </div>
                        </div>

                        {displayProducts.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                                {displayProducts.map((product: any) => (
                                    <ProductCard key={product.id} product={{ ...product, shopName: shop.name }} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-24 bg-white dark:bg-slate-900/50 rounded-[2.5rem] border border-slate-100 dark:border-slate-800/50 max-w-3xl mx-auto shadow-sm">
                                <div className="text-6xl mb-6">🛒</div>
                                <h3 className="text-2xl font-black mb-3">No items available</h3>
                                <p className="text-slate-500 text-lg max-w-sm mx-auto">This shop hasn't added any specific products to their catalogue yet. Please check back later.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
}
