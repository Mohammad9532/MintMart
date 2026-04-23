'use server';

import { PrismaClient, OrderStatus } from '@prisma/client';
import { revalidatePath } from 'next/cache';

const prisma = new PrismaClient();

export async function submitOrder(data: {
    customerName: string,
    customerEmail: string,
    customerPhone: string,
    address: string,
    lat?: number,
    lng?: number,
    totalAmount: number,
    shopId: string,
    items: Array<{
        productId: string,
        quantity: number,
        price: number
    }>
}) {
    try {
        console.log("Submitting Order to Database...", data);

        await prisma.order.create({
            data: {
                totalAmount: data.totalAmount,
                customerEmail: data.customerEmail,
                customerName: data.customerName,
                customerPhone: data.customerPhone,
                address: data.address,
                lat: data.lat,
                lng: data.lng,
                shopId: data.shopId,
                status: 'PENDING',
                items: {
                    create: data.items.map(item => ({
                        productId: item.productId,
                        quantity: item.quantity,
                        price: item.price
                    }))
                }
            }
        });

        revalidatePath('/vendor/dashboard/orders');
        return { success: true };
    } catch (error) {
        console.error("Order submission failed:", error);
        return { success: false, error: "Failed to place order. Database error." };
    }
}
