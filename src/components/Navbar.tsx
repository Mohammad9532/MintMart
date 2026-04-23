'use client';

import React, { useState, useEffect } from 'react';
import { Menu, Search, ShoppingCart, Leaf, X, User, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useSession, signOut } from "next-auth/react";
import { useCartStore } from '@/store/cartStore';

export interface SearchSuggestion {
    id: string;
    title: string;
    subtitle?: string;
    image?: string;
    href?: string;
}

interface NavbarProps {
    onSearch?: (query: string) => void;
    searchQuery?: string;
    searchPlaceholder?: string;
    suggestions?: SearchSuggestion[];
}

export const Navbar = ({ onSearch, searchQuery, searchPlaceholder = "Search...", suggestions = [] }: NavbarProps = {}) => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { data: session } = useSession();

    // State to avoid hydration mismatch (Zustand persists from localStorage)
    const [mounted, setMounted] = useState(false);
    const { items: cartItems, openDrawer } = useCartStore();
    const totalCartItems = mounted ? cartItems.reduce((acc, item) => acc + item.quantity, 0) : 0;

    useEffect(() => {
        setMounted(true);
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
                    {[
                        { name: 'Home', href: '/' },
                        { name: 'Cuisines', href: '/#categories' },
                        { name: 'Restaurants', href: '/#shops' }
                    ].map((item) => (
                        <a
                            key={item.name}
                            href={item.href}
                            className={`font-medium transition-colors ${isScrolled ? 'hover:text-orange-500' : 'hover:text-orange-500'}`}
                        >
                            {item.name}
                        </a>
                    ))}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-4">
                    <div className="relative flex items-center bg-white/10 dark:bg-black/20 px-3 py-2 rounded-full border border-slate-200 dark:border-slate-700/50 focus-within:bg-white dark:focus-within:bg-slate-900 transition-all">
                        <Search className={`w-4 h-4 ${isScrolled ? 'text-white/60' : 'text-slate-400'}`} />
                        <input
                            type="text"
                            placeholder={searchPlaceholder}
                            value={searchQuery || ''}
                            onChange={(e) => onSearch?.(e.target.value)}
                            className={`bg-transparent border-none focus:ring-0 text-sm ml-2 w-32 lg:w-48 outline-none ${isScrolled ? 'placeholder:text-white/40 text-white' : 'text-slate-900'
                                }`}
                        />

                        {/* Desktop Search Suggestions Dropdown */}
                        <AnimatePresence>
                            {searchQuery && suggestions.length > 0 && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 10 }}
                                    className="absolute top-[120%] left-0 w-[280px] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-xl overflow-hidden py-2"
                                >
                                    {suggestions.map((s) => (
                                        <Link
                                            onClick={() => { onSearch?.(''); }}
                                            href={s.href || '#'}
                                            key={s.id}
                                            className="flex items-center gap-3 px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                                        >
                                            {s.image && <img src={s.image} alt={s.title} className="w-10 h-10 rounded-lg object-cover" />}
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-bold text-slate-800 dark:text-white truncate">{s.title}</p>
                                                {s.subtitle && <p className="text-xs text-slate-500 truncate">{s.subtitle}</p>}
                                            </div>
                                        </Link>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                    {session?.user ? (
                        <div className="flex items-center gap-2">
                            {(session.user as any).role === "VENDOR" ? (
                                <Link href="/vendor/dashboard" className={`hidden sm:flex items-center gap-2 text-sm font-bold px-4 py-2 rounded-full transition-all border ${isScrolled ? 'bg-white/20 hover:bg-white/30 text-white border-white/20 shadow-lg' : 'bg-orange-50 hover:bg-orange-100 text-orange-600 border-orange-200'}`}>
                                    <User className="w-4 h-4" />
                                    Vendor Portal
                                </Link>
                            ) : (
                                <Link href="/orders" className={`hidden sm:flex items-center gap-2 text-sm font-bold px-4 py-2 rounded-full transition-all border ${isScrolled ? 'bg-white/20 hover:bg-white/30 text-white border-white/20 shadow-lg' : 'bg-green-50 hover:bg-green-100 text-green-600 border-green-200'}`}>
                                    <User className="w-4 h-4" />
                                    My Orders
                                </Link>
                            )}
                            <button
                                onClick={() => signOut()}
                                className={`hidden sm:flex items-center gap-2 text-sm font-bold p-2 px-3 rounded-full transition-all border ${isScrolled ? 'bg-red-500/20 hover:bg-red-500/40 text-white border-red-500/50' : 'bg-red-50 hover:bg-red-100 text-red-500 border-red-200'}`}
                                title="Sign Out"
                            >
                                <LogOut className="w-4 h-4" />
                            </button>
                        </div>
                    ) : (
                        <Link href="/login" className={`hidden sm:flex text-sm font-bold border px-4 py-2 rounded-full transition-all ${isScrolled ? 'text-white border-white/20 hover:bg-white/10' : 'text-slate-600 border-slate-200 hover:bg-slate-50'}`}>
                            Sign In
                        </Link>
                    )}

                    <button onClick={openDrawer} className={`relative p-2 rounded-full transition-colors group ${isScrolled ? 'hover:bg-white/10' : 'hover:bg-orange-100 dark:hover:bg-orange-900/30'
                        }`}>
                        <ShoppingCart className="w-6 h-6" />
                        {totalCartItems > 0 && (
                            <span className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center bg-red-500 text-white font-bold text-[10px] border-2 border-white dark:border-slate-950 rounded-full">
                                {totalCartItems}
                            </span>
                        )}
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
                            {[
                                { name: 'Home', href: '/' },
                                { name: 'Cuisines', href: '/#categories' },
                                { name: 'Restaurants', href: '/#shops' }
                            ].map((item) => (
                                <a
                                    key={item.name}
                                    href={item.href}
                                    className="text-lg font-medium p-2"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    {item.name}
                                </a>
                            ))}
                            <div className="relative flex items-center glass rounded-xl px-4 py-3">
                                <Search className="w-5 h-5 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder={searchPlaceholder}
                                    value={searchQuery || ''}
                                    onChange={(e) => onSearch?.(e.target.value)}
                                    className="bg-transparent border-none focus:ring-0 text-md ml-2 w-full outline-none"
                                />

                                {/* Mobile Search Suggestions Dropdown */}
                                <AnimatePresence>
                                    {searchQuery && suggestions.length > 0 && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 5 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 5 }}
                                            className="absolute top-[110%] left-0 right-0 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-xl overflow-hidden py-2 z-50"
                                        >
                                            {suggestions.map((s) => (
                                                <Link
                                                    onClick={() => { onSearch?.(''); setIsMobileMenuOpen(false); }}
                                                    href={s.href || '#'}
                                                    key={s.id}
                                                    className="flex items-center gap-3 px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                                                >
                                                    {s.image && <img src={s.image} alt={s.title} className="w-10 h-10 rounded-lg object-cover" />}
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-bold text-slate-800 dark:text-white truncate">{s.title}</p>
                                                        {s.subtitle && <p className="text-xs text-slate-500 truncate">{s.subtitle}</p>}
                                                    </div>
                                                </Link>
                                            ))}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};
