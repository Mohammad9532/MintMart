'use server';

import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";

const prisma = new PrismaClient();

export async function approveApplication(id: string) {
    try {
        // Find the application
        const app = await prisma.vendorApplication.findUnique({ where: { id } });
        if (!app) return { success: false, error: "Application not found" };

        if (app.status !== "PENDING") {
            return { success: false, error: "Already processed" };
        }

        // Create the user account with Vendor role
        const user = await prisma.user.create({
            data: {
                name: app.name,
                email: app.email,
                password: "password123", // In production, email a setup link. Using prototype default.
                role: "VENDOR"
            }
        });

        // Initialize their empty shop infrastructure
        await prisma.shop.create({
            data: {
                name: app.shopName,
                ownerId: user.id,
                image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                tags: ["New"],
                deliveryTime: "30-40 min"
            }
        });

        // Mark application as Approved
        await prisma.vendorApplication.update({
            where: { id },
            data: { status: "APPROVED" }
        });

        revalidatePath('/admin/applications');
        return { success: true };
    } catch (err) {
        console.error("Failed to approve", err);
        return { success: false, error: "Failed to approve application" };
    }
}

export async function rejectApplication(id: string) {
    try {
        await prisma.vendorApplication.update({
            where: { id },
            data: { status: "REJECTED" }
        });
        revalidatePath('/admin/applications');
        return { success: true };
    } catch (err) {
        console.error("Failed to reject", err);
        return { success: false, error: "Failed to reject application" };
    }
}
