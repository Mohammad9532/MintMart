'use client';

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut, LayoutDashboard, Building2, Store, ShoppingBag } from "lucide-react";
import { motion } from "framer-motion";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const { data: session } = useSession();

    const links = [
        { href: "/admin/dashboard", label: "Overview", icon: LayoutDashboard },
        { href: "/admin/applications", label: "Applications", icon: Building2 },
        { href: "/admin/shops", label: "Active Shops", icon: Store },
        { href: "/admin/orders", label: "Global Orders", icon: ShoppingBag },
    ];

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col md:flex-row font-sans">
            {/* Sidebar */}
            <aside className="w-full md:w-64 bg-white dark:bg-slate-900 border-r border-slate-100 dark:border-slate-800 flex flex-col">
                <div className="p-6 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-2 mb-1">
                        <div className="w-8 h-8 rounded-lg bg-orange-500 text-white flex items-center justify-center font-black shadow-lg shadow-orange-500/20">A</div>
                        <span className="text-xl font-black tracking-tight text-slate-800 dark:text-white">Admin Control</span>
                    </div>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    {links.map((link) => {
                        const isActive = pathname === link.href;
                        const Icon = link.icon;
                        return (
                            <Link key={link.href} href={link.href} className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all relative font-bold text-sm ${isActive ? 'text-orange-600' : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-800 dark:hover:text-white'}`}>
                                {isActive && (
                                    <motion.div
                                        layoutId="admin-active-nav"
                                        className="absolute inset-0 bg-orange-50 dark:bg-orange-500/10 rounded-xl"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ duration: 0.2 }}
                                    />
                                )}
                                <Icon className="w-5 h-5 relative z-10" />
                                <span className="relative z-10">{link.label}</span>
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-slate-100 dark:border-slate-800">
                    <button
                        onClick={() => signOut({ callbackUrl: '/login' })}
                        className="w-full flex items-center gap-3 px-4 py-3 text-red-500 font-bold text-sm hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-colors"
                    >
                        <LogOut className="w-5 h-5" />
                        Administrator Logout
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 h-screen overflow-y-auto">
                <div className="p-6 md:p-10 max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {children}
                </div>
            </main>
        </div>
    );
}
