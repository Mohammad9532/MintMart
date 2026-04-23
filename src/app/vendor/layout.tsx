import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import Link from 'next/link';
import { LayoutDashboard, UtensilsCrossed, ReceiptText, Settings, Leaf } from "lucide-react";
import SignOutButton from "@/components/SignOutButton";

export default async function VendorLayout({ children }: { children: React.ReactNode }) {
    const session = await getServerSession(authOptions);

    if (!session || (session.user as any).role !== "VENDOR") {
        redirect("/login");
    }

    const navItems = [
        { name: "Dashboard Hub", href: "/vendor/dashboard", icon: LayoutDashboard },
        { name: "Menu Manager", href: "/vendor/dashboard/menu", icon: UtensilsCrossed },
        { name: "Live Orders", href: "/vendor/dashboard/orders", icon: ReceiptText },
        { name: "Settings", href: "/vendor/dashboard/settings", icon: Settings },
    ];

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col md:flex-row font-sans">

            {/* Sidebar Navigation */}
            <aside className="w-full md:w-72 bg-white dark:bg-slate-900 md:border-r border-b md:border-b-0 border-slate-200 dark:border-slate-800 flex flex-col items-center md:items-stretch py-8 z-20 shadow-sm relative">
                <div className="px-8 mb-10 flex items-center gap-3">
                    <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/30">
                        <Leaf className="text-white w-6 h-6" />
                    </div>
                    <span className="text-2xl font-black tracking-tight text-slate-800 dark:text-white">Vendor</span>
                </div>

                <nav className="flex-1 w-full px-4 flex flex-row overflow-x-auto md:flex-col md:overflow-visible gap-2 no-scrollbar">
                    {navItems.map(item => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="flex flex-shrink-0 items-center gap-3 px-4 py-3 text-slate-600 dark:text-slate-400 hover:text-orange-600 dark:hover:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-500/10 rounded-xl transition-all font-bold group"
                        >
                            <item.icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                            <span className="whitespace-nowrap">{item.name}</span>
                        </Link>
                    ))}
                </nav>

                <div className="hidden md:block w-full px-4 mt-auto">
                    <div className="p-4 bg-orange-50 dark:bg-orange-950/20 rounded-2xl border border-orange-100 dark:border-orange-500/10 mb-4">
                        <p className="font-bold text-slate-800 dark:text-white text-sm">Logged In As</p>
                        <p className="text-orange-600 dark:text-orange-400 text-xs font-bold truncate mt-0.5">{session.user?.email}</p>
                    </div>
                    <SignOutButton />
                </div>
            </aside>

            {/* Main Content Arena */}
            <main className="flex-1 p-6 md:p-12 md:max-w-[calc(100vw-18rem)] overflow-y-auto">
                {children}
            </main>
        </div>
    )
}
