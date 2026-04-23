import { PrismaClient } from "@prisma/client";

import { Building2, Store, Mail, Phone, Clock, User, CheckCircle2, ChevronRight, XCircle } from "lucide-react";
import Link from "next/link";
import { approveApplication, rejectApplication } from "./actions";

const prisma = new PrismaClient();

export default async function AdminApplicationsPage() {
    const applications = await prisma.vendorApplication.findMany({
        where: { status: "PENDING" },
        orderBy: { createdAt: 'desc' }
    });

    return (
        <div className="w-full">
            <div className="container mx-auto px-4 md:px-6 max-w-5xl animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                    <div>
                        <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-2">Admin Portal</h1>
                        <p className="text-slate-500 font-medium text-lg">Review and manage incoming restaurant partnership applications.</p>
                    </div>
                    <div className="bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 px-6 py-3 rounded-2xl font-bold flex items-center gap-3">
                        <Building2 className="w-5 h-5" />
                        {applications.length} Pending
                    </div>
                </div>

                {applications.length === 0 ? (
                    <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-16 text-center border border-slate-100 dark:border-slate-800 shadow-sm">
                        <CheckCircle2 className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold mb-2 text-slate-800 dark:text-white">All caught up!</h2>
                        <p className="text-slate-500 font-medium">There are no new restaurant applications waiting for review.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-6">
                        {applications.map((app: any) => (
                            <div key={app.id} className="bg-white dark:bg-slate-900 rounded-[2rem] p-8 border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col md:flex-row gap-8 items-start md:items-center justify-between transition-all hover:shadow-xl hover:shadow-orange-500/5">
                                <div className="space-y-4 flex-1">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 bg-orange-100 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400 rounded-xl flex items-center justify-center shrink-0">
                                            <Store className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h3 className="font-black text-2xl text-slate-800 dark:text-white">{app.shopName}</h3>
                                            <p className="text-slate-500 text-sm font-bold flex items-center gap-2">
                                                <Clock className="w-4 h-4" />
                                                Applied on {new Date(app.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                                        <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 font-medium text-sm">
                                            <User className="w-4 h-4 text-slate-400" />
                                            {app.name}
                                        </div>
                                        <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 font-medium text-sm">
                                            <Mail className="w-4 h-4 text-slate-400" />
                                            {app.email}
                                        </div>
                                        <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 font-medium text-sm">
                                            <Phone className="w-4 h-4 text-slate-400" />
                                            {app.phone}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-row md:flex-col gap-3 w-full md:w-auto shrink-0">
                                    <form action={approveApplication.bind(null, app.id)}>
                                        <button type="submit" className="w-full md:w-32 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold py-3 px-6 rounded-xl hover:scale-105 transition-transform text-sm text-center">
                                            Approve
                                        </button>
                                    </form>
                                    <form action={rejectApplication.bind(null, app.id)}>
                                        <button type="submit" className="w-full md:w-32 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 font-bold py-3 px-6 rounded-xl hover:bg-red-100 dark:hover:bg-red-500/20 transition-colors text-sm text-center">
                                            Reject
                                        </button>
                                    </form>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

