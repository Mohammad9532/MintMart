import { PrismaClient } from "@prisma/client";
import HomeClient from "@/components/HomeClient";

const prisma = new PrismaClient();

export const dynamic = 'force-dynamic';

export default async function Home() {
  const shops = await prisma.shop.findMany();
  return <HomeClient initialShops={shops} />;
}
