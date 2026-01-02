'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Hero } from '@/components/Hero';
import { ProductCard } from '@/components/ProductCard';
import { products, categories } from '@/data/mock-data';
import { motion } from 'framer-motion';
import { ChevronRight, Clock } from 'lucide-react';

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredProducts = selectedCategory === 'All'
    ? products
    : products.filter(p => p.category === selectedCategory);

  return (
    <main className="min-h-screen bg-[#FDFEFE]">
      <Navbar />

      {/* Welcome Post */}
      <section className="pt-24 pb-8 bg-brand-primary/5">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass p-8 md:p-12 rounded-[2.5rem] border-brand-primary/20 shadow-xl overflow-hidden relative"
          >
            <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 text-center md:text-left">
              <div className="w-24 h-24 primary-gradient rounded-3xl flex items-center justify-center shrink-0 shadow-lg rotate-3">
                <Leaf className="text-white w-12 h-12" />
              </div>
              <div>
                <div className="flex flex-col md:flex-row md:items-center gap-3 mb-4">
                  <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white">
                    Welcome to <span className="text-brand-primary">MintMart!</span> 🌿
                  </h2>
                  <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-brand-secondary/10 text-brand-secondary text-lg font-black border-2 border-brand-secondary/30 shadow-md animate-pulse">
                    <Clock className="w-5 h-5" />
                    Coming Soon
                  </div>
                </div>
                <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed max-w-3xl">
                  We are thrilled to embark on this journey with you. MintMart is evolving into your go-to general store for everything premium. While we're putting the final touches on our full catalog, feel free to browse our essentials. We're launching soon—stay tuned!
                </p>
              </div>
            </div>

            {/* Background flourish */}
            <div className="absolute top-[-20%] right-[-5%] w-64 h-64 bg-brand-primary/10 blur-3xl rounded-full" />
          </motion.div>
        </div>
      </section>

      <Hero />

      {/* Featured Categories */}
      <section className="py-12 bg-white dark:bg-slate-900/30">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold">Shop by <span className="text-brand-secondary">Department</span></h2>
            <button className="flex items-center gap-1 text-brand-secondary font-semibold hover:underline">
              View All <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((cat) => (
              <motion.button
                key={cat.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedCategory(cat.name)}
                className={`p-6 rounded-3xl flex flex-col items-center gap-3 transition-all ${selectedCategory === cat.name
                  ? 'primary-gradient text-white shadow-lg shadow-brand-primary/30'
                  : 'bg-brand-primary/5 dark:bg-slate-800 hover:bg-brand-primary/10 dark:hover:bg-slate-700'
                  }`}
              >
                <span className="text-3xl">{cat.icon}</span>
                <span className="font-bold text-sm text-slate-900 dark:text-white">{cat.name}</span>
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* Product Grid */}
      <section id="categories" className="py-20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
            <div>
              <h2 className="text-4xl font-black mb-2 text-slate-900 dark:text-white">Our <span className="text-gradient">Essentials</span></h2>
              <p className="text-slate-500">Discover quality products across all departments.</p>
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
              <button
                onClick={() => setSelectedCategory('All')}
                className={`px-6 py-2.5 rounded-full font-bold whitespace-nowrap transition-all ${selectedCategory === 'All'
                  ? 'bg-brand-secondary text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 hover:bg-slate-200'
                  }`}
              >
                All Products
              </button>
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.name)}
                  className={`px-6 py-2.5 rounded-full font-bold whitespace-nowrap transition-all ${selectedCategory === cat.name
                    ? 'bg-brand-secondary text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 hover:bg-slate-200'
                    }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-2xl font-bold mb-2">No products found</h3>
              <p className="text-slate-500">Try selecting a different category or search term.</p>
            </div>
          )}
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="primary-gradient rounded-[3rem] p-8 md:p-16 text-white text-center relative overflow-hidden shadow-2xl">
            <div className="relative z-10">
              <div className="inline-block px-4 py-1 rounded-full bg-brand-accent text-brand-secondary text-sm font-bold mb-6">
                Special Offer
              </div>
              <h2 className="text-3xl md:text-5xl font-black mb-6">Be the First to Know!</h2>
              <p className="text-white/80 mb-10 text-lg max-w-2xl mx-auto">
                Subscribe to our launch list and get an exclusive 20% discount code once we go live!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-6 py-4 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 placeholder:text-white/60 outline-none focus:bg-white/30 transition-all"
                />
                <button className="bg-brand-accent text-brand-secondary px-8 py-4 rounded-2xl font-black hover:scale-105 transition-transform shadow-xl">
                  Notify Me
                </button>
              </div>
            </div>
            {/* Decorative blobs */}
            <div className="absolute top-[-50%] right-[-10%] w-[60%] h-[120%] bg-white/10 blur-[100px] rounded-full" />
            <div className="absolute bottom-[-50%] left-[-10%] w-[40%] h-[80%] bg-black/5 blur-[80px] rounded-full" />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-brand-secondary text-white py-12 border-t border-white/10">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-1 md:col-span-1">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 primary-gradient rounded-lg flex items-center justify-center">
                  <Leaf className="text-white w-5 h-5" />
                </div>
                <span className="text-xl font-bold">MintMart</span>
              </div>
              <p className="text-white/60 text-sm leading-relaxed">
                Premium shopping experience. Quality guaranteed at your doorstep.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-6 text-brand-accent">Quick Links</h4>
              <ul className="space-y-4 text-sm text-white/60">
                <li><a href="#" className="hover:text-brand-primary transition-colors">Home</a></li>
                <li><a href="#" className="hover:text-brand-primary transition-colors">Categories</a></li>
                <li><a href="#" className="hover:text-brand-primary transition-colors">Deals</a></li>
                <li><a href="#" className="hover:text-brand-primary transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-6 text-brand-accent">Support</h4>
              <ul className="space-y-4 text-sm text-white/60">
                <li><a href="#" className="hover:text-brand-primary transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-brand-primary transition-colors">Shipping Info</a></li>
                <li><a href="#" className="hover:text-brand-primary transition-colors">Returns</a></li>
                <li><a href="#" className="hover:text-brand-primary transition-colors">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-6 text-brand-accent">Contact</h4>
              <ul className="space-y-4 text-sm text-white/60">
                <li>beingsheikh7@gmail.com</li>
                <li>+91 7376445451 (WhatsApp Only)</li>
                <li>123 Fresh way, Green City</li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-white/40">
            <p>© 2026 MintMart Everything Store. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-white">Privacy Policy</a>
              <a href="#" className="hover:text-white">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}

// Re-using Leaf icon in footer
const Leaf = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 3.5 1.4 9.2-1.3 10-10.4 10.8-10.4 10.8Z" />
    <path d="M19 2s-4.5 9-11 9" />
  </svg>
);
