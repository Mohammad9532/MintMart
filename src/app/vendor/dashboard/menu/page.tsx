import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { PrismaClient } from "@prisma/client";
import VendorMenuTable from "@/components/VendorMenuTable";

const prisma = new PrismaClient();

export default async function MenuManager() {
    const session = await getServerSession(authOptions);
    const userId = (session?.user as any)?.id;

    // Fetch shops with products to display a unified table for all restaurants owned by the vendor
    const shops = await prisma.shop.findMany({
        where: { ownerId: userId },
        include: { products: true }
    });

    const products = shops.flatMap(shop => shop.products.map(p => ({ ...p, shopName: shop.name })));

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <VendorMenuTable initialProducts={products} shops={shops} />
        </div>
    );
}
