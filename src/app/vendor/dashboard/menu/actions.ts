'use server';

import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";

const prisma = new PrismaClient();

export async function deleteProduct(productId: string) {
    try {
        await prisma.product.delete({ where: { id: productId } });
        revalidatePath('/vendor/dashboard/menu');
        return { success: true };
    } catch (error) {
        console.error(error);
        return { success: false, error: "Failed to delete product." };
    }
}

export async function createProduct(data: { name: string, price: number, description: string, image: string, category: string, shopId: string, isPopular: boolean, isAvailable: boolean }) {
    try {
        await prisma.product.create({ data });
        revalidatePath('/vendor/dashboard/menu');
        revalidatePath('/');
        return { success: true };
    } catch (error) {
        console.error(error);
        return { success: false, error: "Failed to create product." };
    }
}

export async function updateProduct(productId: string, data: Partial<{ name: string, price: number, description: string, image: string, category: string, shopId: string, isPopular: boolean, isAvailable: boolean }>) {
    try {
        await prisma.product.update({ where: { id: productId }, data });
        revalidatePath('/vendor/dashboard/menu');
        revalidatePath('/');
        return { success: true };
    } catch (error) {
        console.error(error);
        return { success: false, error: "Failed to update product." };
    }
}
