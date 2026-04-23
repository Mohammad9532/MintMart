'use client';

import React, { useState } from 'react';
import { Plus, Edit, Trash2, X, Loader2, ToggleRight, ToggleLeft } from "lucide-react";
import { createProduct, updateProduct, deleteProduct } from '@/app/vendor/dashboard/menu/actions';

type Product = any;
type Shop = any;

export default function VendorMenuTable({ initialProducts, shops }: { initialProducts: Product[], shops: Shop[] }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    // Form state
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        description: '',
        image: '/images/products/placeholder.jpg',
        category: 'Burgers',
        shopId: shops[0]?.id || '',
        isPopular: false,
        isAvailable: true
    });

    const openCreateModal = () => {
        setEditingId(null);
        setFormData({
            name: '',
            price: '',
            description: '',
            image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&q=80',
            category: 'Burgers',
            shopId: shops[0]?.id || '',
            isPopular: false,
            isAvailable: true
        });
        setIsModalOpen(true);
    };

    const openEditModal = (product: Product) => {
        setEditingId(product.id);
        setFormData({
            name: product.name,
            price: product.price.toString(),
            description: product.description || '',
            image: product.image,
            category: product.category,
            shopId: product.shopId,
            isPopular: product.isPopular,
            isAvailable: product.isAvailable ?? true
        });
        setIsModalOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm("Are you sure you want to delete this menu item?")) return;
        await deleteProduct(id);
    };

    const handleToggleStock = async (id: string, currentStatus: boolean) => {
        await updateProduct(id, { isAvailable: !currentStatus });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const payload = {
                ...formData,
                price: parseFloat(formData.price) || 0,
            };

            if (editingId) {
                await updateProduct(editingId, payload);
            } else {
                await createProduct(payload);
            }
            setIsModalOpen(false);
        } catch (error) {
            alert("An error occurred");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-black text-slate-800 dark:text-white mb-2 tracking-tight">Menu Manager</h1>
                    <p className="text-slate-500 font-medium text-lg">Manage the food items across all your restaurants.</p>
                </div>
                <button onClick={openCreateModal} className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-2xl flex items-center gap-2 shadow-lg shadow-orange-500/20 transition-all hover:-translate-y-1">
                    <Plus className="w-5 h-5 flex-shrink-0" />
                    <span className="whitespace-nowrap">Add New Item</span>
                </button>
            </div>

            {/* Data Table */}
            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2rem] shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
                                <th className="py-5 px-6 font-bold text-slate-500">Item</th>
                                <th className="py-5 px-6 font-bold text-slate-500 hidden md:table-cell">Restaurant</th>
                                <th className="py-5 px-6 font-bold text-slate-500 hidden sm:table-cell">Category</th>
                                <th className="py-5 px-6 font-bold text-slate-500">Price</th>
                                <th className="py-5 px-6 font-bold text-slate-500 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {initialProducts.map((product) => {
                                const isAvailable = product.isAvailable ?? true;
                                return (
                                    <tr key={product.id} className={`border-b border-slate-50 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors ${!isAvailable && 'opacity-60 grayscale-[0.6]'}`}>
                                        <td className="py-4 px-6 flex items-center gap-4 min-w-[200px]">
                                            <div className="relative">
                                                <img src={product.image} className="w-12 h-12 rounded-xl object-cover flex-shrink-0" />
                                                {!isAvailable && <span className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 border-2 border-white dark:border-slate-900 rounded-full"></span>}
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-800 dark:text-white line-clamp-1">{product.name} {!isAvailable && <span className="text-red-500 text-xs">(Out of stock)</span>}</p>
                                                <div className="flex gap-2 items-center mt-1">
                                                    {product.isPopular && <span className="text-[10px] uppercase font-black text-orange-500 bg-orange-100 dark:bg-orange-500/20 px-2 py-0.5 rounded-full inline-block">Popular</span>}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6 text-slate-600 dark:text-slate-400 font-medium hidden md:table-cell min-w-[150px]">{product.shopName}</td>
                                        <td className="py-4 px-6 text-slate-600 dark:text-slate-400 font-medium hidden sm:table-cell">{product.category}</td>
                                        <td className="py-4 px-6 text-slate-800 dark:text-slate-200 font-black">${product.price.toFixed(2)}</td>
                                        <td className="py-4 px-6 text-right space-x-2 whitespace-nowrap flex items-center justify-end">
                                            <button onClick={() => handleToggleStock(product.id, isAvailable)} className={`p-2 rounded-xl transition-colors inline-block ${isAvailable ? 'text-green-600 hover:bg-green-50 dark:hover:bg-green-500/10' : 'text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`} title={isAvailable ? "Mark Out of Stock" : "Mark In Stock"}>
                                                {isAvailable ? <ToggleRight className="w-5 h-5" /> : <ToggleLeft className="w-5 h-5" />}
                                            </button>
                                            <button onClick={() => openEditModal(product)} className="p-2 text-slate-400 hover:text-blue-500 bg-slate-50 hover:bg-blue-50 dark:bg-slate-800 dark:hover:bg-blue-900/30 rounded-xl transition-colors inline-block">
                                                <Edit className="w-5 h-5" />
                                            </button>
                                            <button onClick={() => handleDelete(product.id)} className="p-2 text-slate-400 hover:text-red-500 bg-slate-50 hover:bg-red-50 dark:bg-slate-800 dark:hover:bg-red-900/30 rounded-xl transition-colors inline-block">
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </td>
                                    </tr>
                                )
                            })}
                            {initialProducts.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="py-12 text-center text-slate-500">
                                        No items found. Create your first menu item!
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Unified Add/Edit Form Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm overflow-y-auto">
                    <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-[2.5rem] shadow-2xl p-8 border border-slate-100 dark:border-slate-800 relative mt-20 sm:mt-0">
                        <button onClick={() => setIsModalOpen(false)} className="absolute top-6 right-6 p-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-full transition-colors">
                            <X className="w-5 h-5" />
                        </button>

                        <h2 className="text-2xl font-black text-slate-800 dark:text-white mb-6">
                            {editingId ? 'Edit Menu Item' : 'Create Menu Item'}
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1 ml-1">Name</label>
                                <input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 rounded-2xl px-4 py-3 outline-none" placeholder="e.g. Classic Cheeseburger" />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1 ml-1">Price ($)</label>
                                    <input type="number" step="0.01" required value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 rounded-2xl px-4 py-3 outline-none" placeholder="10.99" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1 ml-1">Category</label>
                                    <input type="text" required value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 rounded-2xl px-4 py-3 outline-none" placeholder="Burgers, Snacks..." />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1 ml-1">Assign to Restaurant</label>
                                <select required value={formData.shopId} onChange={(e) => setFormData({ ...formData, shopId: e.target.value })} className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 rounded-2xl px-4 py-3 outline-none appearance-none">
                                    {shops.map(shop => (
                                        <option key={shop.id} value={shop.id}>{shop.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1 ml-1">Image URL</label>
                                <input type="url" required value={formData.image} onChange={(e) => setFormData({ ...formData, image: e.target.value })} className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 rounded-2xl px-4 py-3 outline-none" placeholder="https://..." />
                            </div>

                            <div className="flex gap-4">
                                <label className="flex-1 flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl cursor-pointer">
                                    <input type="checkbox" checked={formData.isAvailable} onChange={(e) => setFormData({ ...formData, isAvailable: e.target.checked })} className="w-5 h-5 rounded border-slate-300 text-green-500 focus:ring-green-500" />
                                    <span className="text-sm font-bold text-slate-700 dark:text-slate-300">In Stock</span>
                                </label>
                                <label className="flex-1 flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl cursor-pointer">
                                    <input type="checkbox" checked={formData.isPopular} onChange={(e) => setFormData({ ...formData, isPopular: e.target.checked })} className="w-5 h-5 rounded border-slate-300 text-orange-500 focus:ring-orange-500" />
                                    <span className="text-sm font-bold text-slate-700 dark:text-slate-300">Popular</span>
                                </label>
                            </div>

                            <button type="submit" disabled={isSubmitting} className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 rounded-2xl mt-4 transition-all hover:shadow-lg shadow-orange-500/20 disabled:opacity-70 flex justify-center items-center gap-2">
                                {isSubmitting && <Loader2 className="w-5 h-5 animate-spin" />}
                                {editingId ? 'Save Changes' : 'Create Item'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
