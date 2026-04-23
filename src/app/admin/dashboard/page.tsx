import { PrismaClient } from "@prisma/client";
import { Store, ShoppingBag, Users, Building2, TrendingUp, DollarSign } from "lucide-react";
import Link from "next/link";

const prisma = new PrismaClient();

export default async function AdminDashboardPage() {
    // Parallel fetch core metrics for massive speedup
    const [shopsCount, activeOrdersCount, applicationsCount, customersCount, orders] = await Promise.all([
        prisma.shop.count(),
        prisma.order.count({ where: { status: { notIn: ["DELIVERED", "CANCELLED"] } } }),
        prisma.vendorApplication.count({ where: { status: "PENDING" } }),
        prisma.user.count({ where: { role: "CUSTOMER" } }),
        prisma.order.findMany({ select: { totalAmount: true } }) // A bit heavy in prod, but fine for prototype
    ]);

    const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);

    return (
        <div className="w-full">
            <div className="mb-10">
                <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-2">Master Overview</h1>
                <p className="text-slate-500 font-medium text-lg">Real-time telemetry across the entire MintMart ecosystem.</p>
            </div>

            {/* Top Level KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">

                <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-8 border border-slate-100 dark:border-slate-800 shadow-sm transition-all hover:shadow-xl hover:shadow-orange-500/5 group relative overflow-hidden">
                    <div className="absolute -right-6 -top-6 w-32 h-32 bg-orange-50 dark:bg-orange-500/5 rounded-full group-hover:scale-150 transition-transform duration-700 pointer-events-none" />
                    <div className="flex items-center justify-between mb-6 relative z-10">
                        <div className="w-14 h-14 bg-orange-100 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400 rounded-2xl flex items-center justify-center">
                            <Store className="w-7 h-7" />
                        </div>
                        <span className="bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                            <TrendingUp className="w-3 h-3" /> Live
                        </span>
                    </div>
                    <div className="relative z-10">
                        <h2 className="text-5xl font-black text-slate-800 dark:text-white tracking-tighter mb-2">{shopsCount}</h2>
                        <p className="text-slate-500 font-bold text-sm uppercase tracking-wider">Active Restaurants</p>
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-8 border border-slate-100 dark:border-slate-800 shadow-sm transition-all hover:shadow-xl hover:shadow-emerald-500/5 group relative overflow-hidden">
                    <div className="absolute -right-6 -top-6 w-32 h-32 bg-emerald-50 dark:bg-emerald-500/5 rounded-full group-hover:scale-150 transition-transform duration-700 pointer-events-none" />
                    <div className="flex items-center justify-between mb-6 relative z-10">
                        <div className="w-14 h-14 bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-2xl flex items-center justify-center">
                            <ShoppingBag className="w-7 h-7" />
                        </div>
                    </div>
                    <div className="relative z-10">
                        <h2 className="text-5xl font-black text-slate-800 dark:text-white tracking-tighter mb-2">{activeOrdersCount}</h2>
                        <p className="text-slate-500 font-bold text-sm uppercase tracking-wider">Orders in Progress</p>
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-8 border border-slate-100 dark:border-slate-800 shadow-sm transition-all hover:shadow-xl hover:shadow-blue-500/5 group relative overflow-hidden">
                    <div className="absolute -right-6 -top-6 w-32 h-32 bg-blue-50 dark:bg-blue-500/5 rounded-full group-hover:scale-150 transition-transform duration-700 pointer-events-none" />
                    <div className="flex items-center justify-between mb-6 relative z-10">
                        <div className="w-14 h-14 bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center">
                            <DollarSign className="w-7 h-7" />
                        </div>
                    </div>
                    <div className="relative z-10">
                        <h2 className="text-5xl font-black text-slate-800 dark:text-white tracking-tighter mb-2">
                            <span className="text-3xl text-slate-400 mr-1">$</span>
                            {(totalRevenue).toFixed(2)}
                        </h2>
                        <p className="text-slate-500 font-bold text-sm uppercase tracking-wider">Gross Platform Volume</p>
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-8 border border-slate-100 dark:border-slate-800 shadow-sm transition-all hover:shadow-xl hover:shadow-indigo-500/5 group relative overflow-hidden">
                    <div className="absolute -right-6 -top-6 w-32 h-32 bg-indigo-50 dark:bg-indigo-500/5 rounded-full group-hover:scale-150 transition-transform duration-700 pointer-events-none" />
                    <div className="flex items-center justify-between mb-6 relative z-10">
                        <div className="w-14 h-14 bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 rounded-2xl flex items-center justify-center">
                            <Users className="w-7 h-7" />
                        </div>
                    </div>
                    <div className="relative z-10">
                        <h2 className="text-5xl font-black text-slate-800 dark:text-white tracking-tighter mb-2">{customersCount}</h2>
                        <p className="text-slate-500 font-bold text-sm uppercase tracking-wider">Total Customers</p>
                    </div>
                </div>

                {/* Call to Action Card */}
                <Link href="/admin/applications" className="col-span-1 md:col-span-2 bg-slate-900 dark:bg-white rounded-[2rem] p-8 border border-slate-800 dark:border-slate-200 shadow-lg flex flex-col justify-center items-center text-center transition-all hover:scale-[1.02]">
                    <Building2 className="w-12 h-12 text-orange-500 mb-4" />
                    <h2 className="text-3xl font-black text-white dark:text-slate-900 mb-2">{applicationsCount} Pending Applications</h2>
                    <p className="text-slate-400 dark:text-slate-500 font-medium">Click here to review new incoming partnership requests.</p>
                </Link>

            </div>
        </div>
    );
}
