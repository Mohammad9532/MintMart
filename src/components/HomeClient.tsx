'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Hero } from '@/components/Hero';
import { ShopCard } from '@/components/ShopCard';
import { categories } from '@/data/mock-data';
import { Store, Leaf } from 'lucide-react';

export default function HomeClient({ initialShops }: { initialShops: any[] }) {
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');

    // Filter shops by checking if they include the selected category tag AND match search query
    const filteredShops = initialShops.filter(s => {
        const matchCat = selectedCategory === 'All' || s.tags.includes(selectedCategory);
        const matchSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            s.tags.some((t: string) => t.toLowerCase().includes(searchQuery.toLowerCase()));

        return matchCat && matchSearch;
    });

    const searchSuggestions = searchQuery ? filteredShops.slice(0, 5).map(s => ({
        id: s.id,
        title: s.name,
        subtitle: s.tags.join(' • '),
        image: s.image,
        href: '/shop/' + s.id
    })) : [];

    return (
        <main className="min-h-screen bg-[#FDFEFE] dark:bg-slate-950 overflow-hidden">
            <Navbar
                onSearch={setSearchQuery}
                searchQuery={searchQuery}
                searchPlaceholder="Search restaurants..."
                suggestions={searchSuggestions}
            />

            <div className="pt-20">
                <Hero />
            </div>

            {/* Categories Segment */}
            <section id="categories" className="py-10 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800/50 shadow-sm relative z-10">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Explore <span className="text-orange-500">Cuisines</span></h2>
                    </div>
                    <div className="flex items-center gap-4 overflow-x-auto pb-4 pt-2 no-scrollbar px-2 -mx-2">
                        <button
                            onClick={() => setSelectedCategory('All')}
                            className={`shrink-0 px-6 py-4 rounded-[2rem] flex flex-col items-center justify-center gap-3 transition-all min-w-[110px] sm:min-w-[130px] border-2 ${selectedCategory === 'All'
                                ? 'bg-orange-50 border-orange-500 text-orange-600 shadow-md shadow-orange-500/20'
                                : 'bg-white border-slate-100 dark:bg-slate-800 dark:border-slate-700 hover:border-orange-200 dark:hover:border-orange-800'
                                }`}
                        >
                            <Store className={`w-8 h-8 ${selectedCategory === 'All' ? 'text-orange-500' : 'text-slate-400'}`} />
                            <span className="font-bold text-sm whitespace-nowrap">All Places</span>
                        </button>
                        {categories.map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() => setSelectedCategory(cat.name)}
                                className={`shrink-0 px-6 py-4 rounded-[2rem] flex flex-col items-center justify-center gap-3 transition-all min-w-[110px] sm:min-w-[130px] border-2 ${selectedCategory === cat.name
                                    ? 'bg-orange-50 border-orange-500 text-orange-600 shadow-md shadow-orange-500/20'
                                    : 'bg-white border-slate-100 dark:bg-slate-800 dark:border-slate-700 hover:border-orange-200 dark:hover:border-orange-800'
                                    }`}
                            >
                                <span className="text-3xl">{cat.icon}</span>
                                <span className={`font-bold text-sm whitespace-nowrap ${selectedCategory === cat.name ? 'text-orange-600 dark:text-orange-400' : 'text-slate-600 dark:text-slate-300'}`}>{cat.name}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Shops Grid */}
            <section id="shops" className="py-20 relative">
                <div className="absolute top-0 inset-x-0 h-96 bg-orange-50/50 dark:bg-orange-950/20 -z-10" />
                <div className="container mx-auto px-4 md:px-6">
                    <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
                        <div>
                            <h2 className="text-3xl md:text-4xl font-black mb-3 text-slate-900 dark:text-white">
                                Nearby <span className="text-orange-500">Restaurants</span>
                            </h2>
                            <p className="text-slate-500 text-lg font-medium">Order food from your favorite local restaurants and cafes directly to your door.</p>
                        </div>
                        {filteredShops.length > 0 && (
                            <div className="text-sm font-bold text-orange-600 bg-orange-100 px-4 py-2 rounded-full inline-flex self-start sm:self-auto">
                                {filteredShops.length} places found
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
                        {filteredShops.map((shop) => (
                            <ShopCard key={shop.id} shop={shop} />
                        ))}
                    </div>

                    {filteredShops.length === 0 && (
                        <div className="text-center py-24 bg-white dark:bg-slate-800 rounded-[3rem] shadow-sm border border-slate-100 dark:border-slate-700 mt-8 max-w-3xl mx-auto">
                            <div className="text-6xl mb-6">🏪</div>
                            <h3 className="text-2xl font-black mb-3 text-slate-800 dark:text-white">No restaurants found</h3>
                            <p className="text-slate-500 text-lg max-w-md mx-auto">We couldn't find any places in the "{selectedCategory}" cuisine right now. Try selecting another one!</p>
                            <button
                                onClick={() => setSelectedCategory('All')}
                                className="mt-8 bg-orange-500 text-white font-bold px-8 py-3 rounded-full hover:bg-orange-600 transition-colors shadow-lg shadow-orange-500/20"
                            >
                                View all places
                            </button>
                        </div>
                    )}
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-slate-900 text-white py-16 border-t border-slate-800">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="grid md:grid-cols-4 gap-12 mb-12">
                        <div className="col-span-1 md:col-span-1">
                            <div className="flex items-center gap-2 mb-6">
                                <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/30">
                                    <Leaf className="text-white w-6 h-6" />
                                </div>
                                <span className="text-2xl font-black tracking-tight">MintMart</span>
                            </div>
                            <p className="text-white/60 text-sm leading-relaxed max-w-xs">
                                Your neighborhood food delivery. Hot, fresh, and exactly what you crave.
                            </p>
                        </div>
                        <div>
                            <h4 className="font-bold mb-6 text-orange-400">Quick Links</h4>
                            <ul className="space-y-4 text-sm text-white/60">
                                <li><a href="#" className="hover:text-orange-400 transition-colors">Home</a></li>
                                <li><a href="#" className="hover:text-orange-400 transition-colors">All Stores</a></li>
                                <li><a href="#" className="hover:text-orange-400 transition-colors">Daily Deals</a></li>
                                <li><a href="#" className="hover:text-orange-400 transition-colors">Driver Sign up</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold mb-6 text-orange-400">Support</h4>
                            <ul className="space-y-4 text-sm text-white/60">
                                <li><a href="#" className="hover:text-orange-400 transition-colors">Help Center</a></li>
                                <li><a href="#" className="hover:text-orange-400 transition-colors">Delivery Info</a></li>
                                <li><a href="#" className="hover:text-orange-400 transition-colors">Refund Policy</a></li>
                                <li><a href="#" className="hover:text-orange-400 transition-colors">FAQ</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold mb-6 text-orange-400">Contact</h4>
                            <ul className="space-y-4 text-sm text-white/60">
                                <li>support@mintmart.local</li>
                                <li>+1 (555) MINT-MART</li>
                                <li>123 Marketplace Ave, Tech City</li>
                            </ul>
                        </div>
                    </div>
                    <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-white/40">
                        <p>© 2026 MintMart Marketplace. All rights reserved.</p>
                        <div className="flex gap-6 font-medium">
                            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                        </div>
                    </div>
                </div>
            </footer>
        </main>
    );
}
