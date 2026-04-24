'use client';
import { updateOrderStatus } from './actions';
import { useState, useTransition } from 'react';
import { Loader2 } from 'lucide-react';
import { OrderStatus } from '@prisma/client';

export default function OrderStatusSelect({ orderId, initialStatus }: { orderId: string, initialStatus: OrderStatus }) {
    const [isPending, startTransition] = useTransition();

    const STATUS_COLORS: Record<OrderStatus, string> = {
        PENDING: 'border-yellow-200 bg-yellow-50 text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-400 dark:border-yellow-500/20',
        PREPARING: 'border-blue-200 bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20',
        OUT_FOR_DELIVERY: 'border-purple-200 bg-purple-50 text-purple-700 dark:bg-purple-500/10 dark:text-purple-400 dark:border-purple-500/20',
        DELIVERED: 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20',
        CANCELLED: 'border-red-200 bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20',
    };

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        startTransition(async () => {
            await updateOrderStatus(orderId, e.target.value as OrderStatus);
        });
    }

    return (
        <div className="relative">
            <select
                disabled={isPending}
                value={initialStatus}
                onChange={handleChange}
                className={`w-full appearance-none px-6 py-4 rounded-xl font-bold border-2 transition-all cursor-pointer outline-none ${STATUS_COLORS[initialStatus]} ${isPending ? 'opacity-50' : 'hover:brightness-95'}`}
            >
                <option value="PENDING">PENDING</option>
                <option value="PREPARING">PREPARING</option>
                <option value="OUT_FOR_DELIVERY">OUT FOR DELIVERY</option>
                <option value="DELIVERED">DELIVERED</option>
                <option value="CANCELLED">CANCELLED</option>
            </select>

            {isPending && (
                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                    <Loader2 className="w-5 h-5 animate-spin" />
                </div>
            )}

            {/* Custom dropdown arrow */}
            {!isPending && (
                <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg className="w-4 h-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
            )}
        </div>
    );
}
