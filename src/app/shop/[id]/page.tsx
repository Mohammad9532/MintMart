import { PrismaClient } from "@prisma/client";
import ShopClient from "@/components/ShopClient";
import Link from 'next/link';
import { Navbar } from "@/components/Navbar";

const prisma = new PrismaClient();

export const dynamic = 'force-dynamic';

export default async function ShopDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = await params;

    const shop = await prisma.shop.findUnique({
        where: { id: resolvedParams.id },
        include: { products: true }
    });

    if (!shop) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center flex-col">
                <Navbar />
                <div className="text-8xl mb-6 mt-20">🏪</div>
                <h1 className="text-3xl font-black text-slate-800">Shop not found</h1>
                <p className="text-slate-500 mt-2">The store you are looking for might be unavailable.</p>
                <Link href="/" className="bg-orange-500 text-white mt-8 font-bold px-8 py-3 rounded-full hover:bg-orange-600 transition-colors shadow-lg">
                    Back to Home
                </Link>
            </div>
        );
    }

    return <ShopClient shop={shop} initialProducts={shop.products} />;
}
