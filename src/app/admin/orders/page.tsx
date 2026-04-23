import { PrismaClient } from "@prisma/client";
import { ShoppingBag, Clock, MapPin, User, Package, Circle } from "lucide-react";
import Link from "next/link";

const prisma = new PrismaClient();

export default async function AdminOrdersPage() {
    const orders = await prisma.order.findMany({
        include: {
            shop: { select: { name: true } },
            items: { include: { product: { select: { name: true } } } }
        },
        orderBy: { createdAt: 'desc' }
    });

    const statusColors: any = {
        PENDING: "bg-orange-100 text-orange-600 border-orange-200",
        PREPARING: "bg-blue-100 text-blue-600 border-blue-200",
        OUT_FOR_DELIVERY: "bg-purple-100 text-purple-600 border-purple-200",
        DELIVERED: "bg-emerald-100 text-emerald-600 border-emerald-200",
        CANCELLED: "bg-red-100 text-red-600 border-red-200",
    };

    return (
        <div className="w-full">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-2">Global Live Stream</h1>
                    <p className="text-slate-500 font-medium text-lg">Monitor all transactions happening across all vendors instantly.</p>
                </div>
                <div className="bg-slate-100 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 px-6 py-3 rounded-2xl font-bold flex items-center gap-3 border border-slate-200 dark:border-slate-700">
                    <ShoppingBag className="w-5 h-5" />
                    {orders.length} Global Logs
                </div>
            </div>

            <div className="space-y-4">
                {orders.map((order) => (
                    <div key={order.id} className="bg-white dark:bg-slate-900 rounded-[2rem] p-6 md:p-8 border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col md:flex-row gap-8 items-start md:items-center justify-between transition-all hover:shadow-xl hover:shadow-orange-500/5">

                        <div className="flex-1 space-y-4">
                            <div className="flex items-center gap-3">
                                <span className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider border ${statusColors[order.status]}`}>
                                    {order.status.replace(/_/g, ' ')}
                                </span>
                                <span className="text-slate-500 text-sm font-bold flex items-center gap-2">
                                    <Clock className="w-4 h-4" />
                                    {new Date(order.createdAt).toLocaleString()}
                                </span>
                            </div>

                            <div>
                                <h3 className="font-black text-2xl text-slate-800 dark:text-white flex items-center gap-2">
                                    <span className="text-orange-500 truncate max-w-[200px]">{order.shop.name}</span>
                                    <span className="text-slate-300 dark:text-slate-700">/</span>
                                    <span className="truncate">Order #{order.id.slice(-6)}</span>
                                </h3>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 font-medium text-sm">
                                    <User className="w-4 h-4 text-slate-400 shrink-0" />
                                    <span className="truncate">{order.customerName} ({order.customerPhone})</span>
                                </div>
                                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 font-medium text-sm">
                                    <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                                    <span className="truncate">{order.address}</span>
                                </div>
                            </div>
                        </div>

                        <div className="w-full md:w-64 shrink-0 bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-6 border border-slate-100 dark:border-slate-800">
                            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-3">Order Invoice</p>
                            <div className="space-y-2 mb-4">
                                {order.items.slice(0, 3).map((item) => (
                                    <div key={item.id} className="flex items-start justify-between text-sm">
                                        <div className="flex gap-2">
                                            <span className="text-slate-400 font-bold">{item.quantity}x</span>
                                            <span className="text-slate-700 dark:text-slate-300 font-medium truncate max-w-[120px]">{item.product.name}</span>
                                        </div>
                                        <span className="text-slate-500 font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                                    </div>
                                ))}
                                {order.items.length > 3 && (
                                    <div className="text-xs text-slate-500 font-medium pt-1 italic">...and {order.items.length - 3} more items</div>
                                )}
                            </div>
                            <div className="pt-4 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between">
                                <span className="font-bold text-slate-800 dark:text-white">Total</span>
                                <span className="font-black text-xl text-orange-500">${order.totalAmount.toFixed(2)}</span>
                            </div>
                        </div>

                    </div>
                ))}

                {orders.length === 0 && (
                    <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-16 text-center border border-slate-100 dark:border-slate-800 shadow-sm">
                        <Package className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold mb-2 text-slate-800 dark:text-white">No active orders found</h2>
                        <p className="text-slate-500 font-medium">The global transaction feed is currently empty.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
