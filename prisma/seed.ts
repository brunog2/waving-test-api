import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { categories, generateProducts } from './seed-data';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('123', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'adm@wt.com' },
    update: {},
    create: {
      email: 'adm@wt.com',
      name: 'Administrator',
      password: hashedPassword,
      role: Role.ADMIN,
    },
  });

  const customer = await prisma.user.upsert({
    where: { email: 'customer@wt.com' },
    update: {},
    create: {
      email: 'customer@wt.com',
      name: 'Default Customer',
      password: hashedPassword,
      role: Role.CUSTOMER,
    },
  });

  // Create categories
  for (const category of categories) {
    await prisma.category.upsert({
      where: { name: category.name },
      update: {},
      create: category,
    });
  }

  // Get all categories
  const allCategories = await prisma.category.findMany();

  // Create products for each category
  for (const category of allCategories) {
    const products = generateProducts(category.id, category.name);
    for (const product of products) {
      await prisma.product.create({
        data: product,
      });
    }
  }

  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
