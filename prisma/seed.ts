import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.product.deleteMany({});
  await prisma.catalog.deleteMany({});

  const electronicsCatalog = await prisma.catalog.create({
    data: {
      name: 'Electronics',
    },
  });

  const clothingCatalog = await prisma.catalog.create({
    data: {
      name: 'Clothing',
    },
  });

  await prisma.product.createMany({
    data: [
      {
        id: 'prod12345',
        name: 'Laptop',
        price: 999.99,
        stockQuantity: 10,
        catalogId: electronicsCatalog.id,
      },
      {
        id: 'prod67890',
        name: 'Smartphone',
        price: 499.99,
        stockQuantity: 25,
        catalogId: electronicsCatalog.id,
      },
      {
        id: 'prod11223',
        name: 'T-shirt',
        price: 19.99,
        stockQuantity: 50,
        catalogId: clothingCatalog.id,
      },
      {
        id: 'prod44556',
        name: 'Jeans',
        price: 39.99,
        stockQuantity: 30,
        catalogId: clothingCatalog.id,
      },
    ],
  });

  console.log('Seed data created!');
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
