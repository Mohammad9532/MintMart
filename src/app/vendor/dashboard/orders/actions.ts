'use server';

import { PrismaClient, OrderStatus } from '@prisma/client';
import { revalidatePath } from 'next/cache';

const prisma = new PrismaClient();

export async function updateOrderStatus(orderId: string, status: OrderStatus) {
    try {
        await prisma.order.update({
            where: { id: orderId },
            data: { status }
        });

        revalidatePath('/vendor/dashboard/orders');
        return { success: true };
    } catch (error) {
        console.error("Failed to update order status:", error);
        return { success: false, error: "Database failure updating status." };
    }
}
