import { PrismaClient } from '@prisma/client';
import { shops, products } from '../src/data/mock-data';

const prisma = new PrismaClient();

async function main() {
    console.log('Clearing old data...');
    await prisma.product.deleteMany({});
    await prisma.shop.deleteMany({});
    await prisma.user.deleteMany({});

    console.log('Creating Test Vendor...');
    const vendor = await prisma.user.create({
        data: {
            name: 'Restaurant Owner',
            email: 'vendor@mintmart.local',
            password: 'password123', // Demo plaintext password, handled securely in Phase 3
            role: 'VENDOR'
        }
    });

    console.log('Porting Mock Shops to MongoDB...');
    const shopMap = new Map<string, string>(); // old ID -> MongoDB ID

    for (const shop of shops) {
        const createdShop = await prisma.shop.create({
            data: {
                name: shop.name,
                image: shop.image,
                tags: shop.tags,
                rating: shop.rating,
                deliveryTime: shop.deliveryTime,
                ownerId: vendor.id,
            }
        });
        shopMap.set(shop.id, createdShop.id);
    }

    console.log('Porting Mock Products to MongoDB...');
    for (const product of products) {
        const realShopId = shopMap.get(product.shopId);
        if (!realShopId) continue;

        await prisma.product.create({
            data: {
                name: product.name,
                description: product.description || '',
                price: product.price,
                image: product.image,
                isPopular: product.isPopular || false,
                category: product.category,
                shopId: realShopId,
            }
        });
    }

    console.log('✅ Seeding complete!');
    console.log('\n--- VENDOR TEST CREDENTIALS ---');
    console.log('Email: vendor@mintmart.local');
    console.log('Password: password123');
    console.log('-------------------------------\n');
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
