import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { PrismaClient } from "@prisma/client";
import { Navbar } from "@/components/Navbar";
import { Clock, ShoppingBag, ArrowLeft, Package, CheckCircle2, XCircle, MapPin } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

const prisma = new PrismaClient();

export default async function CustomerOrdersPage() {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.email) {
        redirect("/login?callbackUrl=/orders");
    }

    const customerEmail = session.user.email;

    const orders = await prisma.order.findMany({
        where: { customerEmail: customerEmail },
        orderBy: { createdAt: 'desc' },
        include: {
            shop: { select: { name: true, image: true } },
            items: {
                include: { product: { select: { name: true, image: true } } }
            }
        }
    });

    const getStatusUI = (status: string) => {
        switch (status) {
            case 'PENDING':
                return <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1"><Clock className="w-3 h-3" /> Pending</span>;
            case 'PREPARING':
                return <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1"><Package className="w-3 h-3" /> Preparing</span>;
            case 'DELIVERED':
                return <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Delivered</span>;
            case 'CANCELLED':
                return <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1"><XCircle className="w-3 h-3" /> Cancelled</span>;
            default:
                return null;
        }
    };

    return (
        <main className="min-h-screen bg-[#FDFEFE] dark:bg-slate-950 pb-20">
            <Navbar />

            <div className="pt-28 container mx-auto px-4 md:px-6 max-w-5xl animate-in fade-in slide-in-from-bottom-4 duration-700">
                <Link href="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-800 dark:hover:text-white font-bold mb-8 transition-colors">
                    <ArrowLeft className="w-5 h-5" />
                    Back to shopping
                </Link>

                <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-2">My Orders</h1>
                <p className="text-slate-500 font-medium mb-10 text-lg">Track your past and active deliveries.</p>

                {orders.length === 0 ? (
                    <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-16 text-center border border-slate-100 dark:border-slate-800 shadow-sm">
                        <ShoppingBag className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold mb-2">No orders found</h2>
                        <p className="text-slate-500 mb-6 font-medium">You haven't placed any orders yet. Hungry?</p>
                        <Link href="/" className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-8 rounded-full shadow-lg shadow-orange-500/20 transition-all inline-block">
                            Explore Restaurants
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {orders.map((order) => (
                            <div key={order.id} className="bg-white dark:bg-slate-900 rounded-[2rem] p-1 border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
                                <div className="p-6 md:p-8">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                                        <div className="flex items-center gap-4">
                                            <img src={order.shop.image} alt={order.shop.name} className="w-14 h-14 rounded-2xl object-cover shrink-0 bg-slate-100" />
                                            <div>
                                                <h3 className="font-black text-xl text-slate-800 dark:text-white">{order.shop.name}</h3>
                                                <p className="text-slate-500 text-sm font-medium flex items-center gap-2">
                                                    {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            {getStatusUI(order.status)}
                                            <div className="font-black text-xl">${order.totalAmount.toFixed(2)}</div>
                                        </div>
                                    </div>

                                    <hr className="border-slate-100 dark:border-slate-800 my-6" />

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div>
                                            <h4 className="font-bold text-slate-800 dark:text-white mb-4">Items Ordered</h4>
                                            <div className="space-y-3">
                                                {order.items.map((item) => (
                                                    <div key={item.id} className="flex items-center justify-between gap-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-8 h-8 bg-slate-100 dark:bg-slate-800 rounded-lg overflow-hidden shrink-0">
                                                                <img src={item.product.image} className="w-full h-full object-cover" />
                                                            </div>
                                                            <span className="font-bold text-slate-700 dark:text-slate-300">
                                                                <span className="text-orange-500 mr-2">{item.quantity}x</span>
                                                                {item.product.name}
                                                            </span>
                                                        </div>
                                                        <span className="font-bold text-slate-500">${(item.price * item.quantity).toFixed(2)}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-800 dark:text-white mb-4">Delivery Details</h4>
                                            <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
                                                <p className="font-bold text-slate-700 dark:text-slate-300">{order.customerName}</p>
                                                <p className="text-sm text-slate-500 mt-1 flex items-start gap-2">
                                                    <MapPin className="w-4 h-4 shrink-0 mt-0.5 text-slate-400" />
                                                    {order.address}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}
