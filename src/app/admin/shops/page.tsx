import { PrismaClient } from "@prisma/client";
import { Store, MapPin, Package, Star } from "lucide-react";

const prisma = new PrismaClient();

export default async function AdminShopsPage() {
    const shops = await prisma.shop.findMany({
        include: {
            owner: true,
            _count: {
                select: { products: true, orders: true }
            }
        },
        orderBy: { name: 'asc' }
    });

    return (
        <div className="w-full">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-2">Active Restaurants</h1>
                    <p className="text-slate-500 font-medium text-lg">Manage and oversee all operational vendors on the platform.</p>
                </div>
                <div className="bg-slate-100 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 px-6 py-3 rounded-2xl font-bold flex items-center gap-3 border border-slate-200 dark:border-slate-700">
                    <Store className="w-5 h-5" />
                    {shops.length} Total Partners
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {shops.map((shop) => (
                    <div key={shop.id} className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col group hover:shadow-xl hover:shadow-orange-500/5 transition-all">
                        <div className="h-48 w-full relative overflow-hidden bg-slate-100 dark:bg-slate-800">
                            <img src={shop.image} alt={shop.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                            <div className="absolute top-4 right-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm px-3 py-1.5 rounded-xl font-bold text-sm text-slate-800 dark:text-white flex items-center gap-1.5 shadow-sm">
                                <Star className="w-4 h-4 text-orange-500 fill-orange-500" />
                                {shop.rating.toFixed(1)}
                            </div>
                        </div>

                        <div className="p-6 flex-1 flex flex-col">
                            <h2 className="text-2xl font-black text-slate-800 dark:text-white mb-1 tracking-tight">{shop.name}</h2>
                            <p className="text-slate-500 text-sm font-medium mb-4 flex items-center gap-1">
                                <MapPin className="w-4 h-4" /> {shop.deliveryTime} radius
                            </p>

                            <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Menu Items</p>
                                    <p className="text-slate-800 dark:text-white font-black text-xl">{shop._count.products}</p>
                                </div>
                                <div>
                                    <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Total Sales</p>
                                    <p className="text-slate-800 dark:text-white font-black text-xl">{shop._count.orders}</p>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 mt-4">
                                <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Owner Contact</p>
                                <p className="text-slate-600 dark:text-slate-300 font-medium text-sm truncate">{shop.owner.email}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
