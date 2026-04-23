'use server';

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function registerUser(data: { name: string, email: string, password: string }) {
    try {
        const existing = await prisma.user.findUnique({
            where: { email: data.email }
        });

        if (existing) {
            return { success: false, error: "An account with this email already exists." };
        }

        await prisma.user.create({
            data: {
                name: data.name,
                email: data.email,
                password: data.password, // Plaintext for demo
                role: 'CUSTOMER'
            }
        });

        return { success: true };
    } catch (err) {
        return { success: false, error: "Database error occurred while registering." };
    }
}

export async function submitVendorApplication(data: { shopName: string, name: string, email: string, phone: string }) {
    try {
        await prisma.vendorApplication.create({
            data: {
                shopName: data.shopName,
                name: data.name,
                email: data.email,
                phone: data.phone,
            }
        });
        return { success: true };
    } catch (err) {
        return { success: false, error: "Failed to submit application." };
    }
}
