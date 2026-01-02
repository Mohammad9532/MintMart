'use client';

import React, { useState, useEffect } from 'react';
import { Search, ShoppingCart, Menu, X, Leaf } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-brand-secondary py-3 shadow-glass text-white' : 'bg-transparent py-5'
                }`}
        >
            <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
                {/* Logo */}
                <div className="flex items-center gap-2">
                    <div className="w-10 h-10 primary-gradient rounded-xl flex items-center justify-center shadow-lg">
                        <Leaf className="text-white w-6 h-6" />
                    </div>
                    <span className="text-2xl font-bold tracking-tight">
                        Mint<span className={`${isScrolled ? 'text-brand-primary' : 'text-brand-primary'}`}>Mart</span>
                    </span>
                </div>

                {/* Desktop Links */}
                <div className="hidden md:flex items-center gap-8">
                    {['Home', 'Categories', 'Deals', 'About'].map((item) => (
                        <a
                            key={item}
                            href={`#${item.toLowerCase()}`}
                            className={`font-medium transition-colors ${isScrolled ? 'hover:text-brand-primary' : 'hover:text-brand-primary'}`}
                        >
                            {item}
                        </a>
                    ))}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-4">
                    <div className={`hidden sm:flex items-center rounded-full px-4 py-2 border ${isScrolled ? 'bg-white/10 border-white/20' : 'glass border-slate-200 dark:border-slate-800'
                        }`}>
                        <Search className={`w-4 h-4 ${isScrolled ? 'text-white/60' : 'text-slate-400'}`} />
                        <input
                            type="text"
                            placeholder="Search store..."
                            className={`bg-transparent border-none focus:ring-0 text-sm ml-2 w-32 lg:w-48 outline-none ${isScrolled ? 'placeholder:text-white/40 text-white' : 'text-slate-900'
                                }`}
                        />
                    </div>
                    <button className={`relative p-2 rounded-full transition-colors group ${isScrolled ? 'hover:bg-white/10' : 'hover:bg-mint-100 dark:hover:bg-mint-900/30'
                        }`}>
                        <ShoppingCart className="w-6 h-6" />
                        <span className="absolute top-0 right-0 w-4 h-4 primary-gradient text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                            0
                        </span>
                    </button>
                    <button
                        className="md:hidden p-2"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? <X /> : <Menu />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800"
                    >
                        <div className="p-4 flex flex-col gap-4">
                            {['Home', 'Categories', 'Deals', 'About'].map((item) => (
                                <a
                                    key={item}
                                    href={`#${item.toLowerCase()}`}
                                    className="text-lg font-medium p-2"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    {item}
                                </a>
                            ))}
                            <div className="flex items-center glass rounded-xl px-4 py-3">
                                <Search className="w-5 h-5 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Search products..."
                                    className="bg-transparent border-none focus:ring-0 text-md ml-2 w-full outline-none"
                                />
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};
