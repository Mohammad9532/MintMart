import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { PrismaClient } from "@prisma/client";
import { Store, UtensilsCrossed, TrendingUp } from "lucide-react";

const prisma = new PrismaClient();

export default async function VendorDashboardHub() {
    const session = await getServerSession(authOptions);
    const userId = (session?.user as any)?.id;

    // Fetch the vendor's total shops and total products from MongoDB
    const shops = await prisma.shop.findMany({
        where: { ownerId: userId },
        include: { _count: { select: { products: true, orders: true } } }
    });

    const totalShops = shops.length;
    const totalProducts = shops.reduce((acc, shop) => acc + shop._count.products, 0);
    const totalOrders = shops.reduce((acc, shop) => acc + shop._count.orders, 0);

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div>
                <h1 className="text-4xl font-black text-slate-800 dark:text-white mb-2 tracking-tight">Dashboard Hub</h1>
                <p className="text-slate-500 font-medium text-lg">Welcome back. Here is your restaurant overview.</p>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-8 rounded-[2rem] shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-slate-500 font-bold mb-1">Active Shops</p>
                        <h2 className="text-4xl font-black text-slate-800 dark:text-white">{totalShops}</h2>
                    </div>
                    <div className="w-14 h-14 bg-orange-100 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400 rounded-2xl flex items-center justify-center">
                        <Store className="w-7 h-7" />
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-8 rounded-[2rem] shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-slate-500 font-bold mb-1">Menu Items</p>
                        <h2 className="text-4xl font-black text-slate-800 dark:text-white">{totalProducts}</h2>
                    </div>
                    <div className="w-14 h-14 bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center">
                        <UtensilsCrossed className="w-7 h-7" />
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-8 rounded-[2rem] shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-slate-500 font-bold mb-1">Total Orders</p>
                        <h2 className="text-4xl font-black text-slate-800 dark:text-white">{totalOrders}</h2>
                    </div>
                    <div className="w-14 h-14 bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-2xl flex items-center justify-center">
                        <TrendingUp className="w-7 h-7" />
                    </div>
                </div>
            </div>

            {/* Quick Actions / Associated Shops */}
            <h3 className="text-2xl font-black text-slate-800 dark:text-white pt-4">Your Restaurants</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {shops.map(shop => (
                    <div key={shop.id} className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2rem] p-4 flex gap-4 shadow-sm items-center hover:shadow-lg transition-shadow">
                        <img src={shop.image} alt={shop.name} className="w-20 h-20 rounded-xl object-cover" />
                        <div>
                            <h4 className="font-bold text-slate-800 dark:text-white text-lg">{shop.name}</h4>
                            <p className="text-slate-500 text-sm font-medium">{shop._count.products} menu items</p>
                        </div>
                    </div>
                ))}
                {totalShops === 0 && (
                    <div className="col-span-full py-10 text-center">
                        <p className="text-slate-500 mb-4">You don't have any restaurants registered yet.</p>
                        <button className="bg-orange-500 text-white font-bold px-6 py-3 rounded-full hover:bg-orange-600 transition-colors shadow-lg shadow-orange-500/20">
                            Create a Restaurant
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
