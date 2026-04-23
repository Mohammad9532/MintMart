import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { PrismaClient } from "@prisma/client";
import { MapPin, Phone, Mail, Clock, ShoppingBag } from "lucide-react";
import OrderStatusSelect from "./OrderStatusSelect";

const prisma = new PrismaClient();

export default async function LiveOrders() {
    const session = await getServerSession(authOptions);
    const userId = (session?.user as any)?.id;

    const shops = await prisma.shop.findMany({
        where: { ownerId: userId },
        select: { id: true }
    });
    const shopIds = shops.map(s => s.id);

    const orders = await prisma.order.findMany({
        where: { shopId: { in: shopIds } },
        orderBy: { createdAt: 'desc' },
        include: {
            shop: { select: { name: true } },
            items: {
                include: { product: { select: { name: true, image: true } } }
            }
        }
    });

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div>
                <h1 className="text-4xl font-black text-slate-800 dark:text-white mb-2 tracking-tight">Live Orders</h1>
                <p className="text-slate-500 font-medium text-lg">Manage incoming dispatches from customers in real-time.</p>
            </div>

            {orders.length === 0 ? (
                <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2rem] p-16 text-center shadow-sm">
                    <ShoppingBag className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-slate-700 dark:text-slate-300">No orders yet</h3>
                    <p className="text-slate-500 mt-2">When customers place orders from your restaurant, they will appear here.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-6">
                    {orders.map((order) => (
                        <div key={order.id} className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-8 rounded-[2rem] shadow-sm flex flex-col md:flex-row gap-8">

                            {/* Order Info */}
                            <div className="flex-1 space-y-6">
                                <div className="flex items-center justify-between">
                                    <div className="inline-flex items-center gap-2 bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 px-4 py-2 rounded-xl font-bold text-sm">
                                        <Clock className="w-4 h-4" />
                                        {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(order.createdAt).toLocaleDateString()}
                                    </div>
                                    <div className="font-black text-2xl text-slate-800 dark:text-white">
                                        ${order.totalAmount.toFixed(2)}
                                    </div>
                                </div>

                                <div className="space-y-3 p-5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                                    <h4 className="font-bold text-slate-800 dark:text-white mb-2">Customer Details</h4>
                                    <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400 text-sm font-medium">
                                        <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-bold text-slate-800 dark:text-white shrink-0">
                                            {order.customerName.charAt(0).toUpperCase()}
                                        </div>
                                        <span>{order.customerName}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-slate-500 text-sm">
                                        <Phone className="w-4 h-4 shrink-0 text-slate-400" />
                                        {order.customerPhone}
                                    </div>
                                    <div className="flex items-center gap-3 text-slate-500 text-sm">
                                        <Mail className="w-4 h-4 shrink-0 text-slate-400" />
                                        {order.customerEmail}
                                    </div>
                                    <div className="flex items-start gap-3 justify-center bg-white dark:bg-slate-900 p-4 rounded-xl shadow-sm mt-4 border border-slate-100 dark:border-slate-700">
                                        <MapPin className="w-5 h-5 shrink-0 text-red-500 mt-1" />
                                        <div>
                                            <p className="font-bold text-slate-800 dark:text-white mb-1">Delivery Address</p>
                                            <p className="text-slate-600 dark:text-slate-400 text-sm">{order.address}</p>
                                            {order.lat && order.lng && (
                                                <a
                                                    href={`https://www.google.com/maps?q=${order.lat},${order.lng}`}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="inline-block mt-2 text-blue-500 font-bold text-xs hover:underline"
                                                >
                                                    Open in Maps
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Order Items & Actions */}
                            <div className="md:w-5/12 flex flex-col justify-between space-y-6">
                                <div className="space-y-4">
                                    <h4 className="font-bold text-slate-800 dark:text-white">Ordered Items · {order.shop.name}</h4>
                                    <div className="space-y-3 max-h-[250px] overflow-y-auto pr-2 custom-scrollbar">
                                        {order.items.map((item) => (
                                            <div key={item.id} className="flex gap-3 items-center">
                                                <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-xl overflow-hidden shrink-0 border border-slate-200 dark:border-slate-700">
                                                    <img src={item.product.image} className="w-full h-full object-cover" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-bold text-slate-800 dark:text-white truncate">{item.product.name}</p>
                                                    <p className="text-sm font-medium text-slate-500">${item.price.toFixed(2)}</p>
                                                </div>
                                                <div className="font-black text-slate-800 dark:text-slate-300 w-8 text-right shrink-0">
                                                    x{item.quantity}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-2 pt-4 border-t border-slate-100 dark:border-slate-800">
                                    <label className="text-sm font-bold text-slate-500">Order Status</label>
                                    <OrderStatusSelect orderId={order.id} initialStatus={order.status} />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
