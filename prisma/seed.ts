import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import {
  categories,
  generateProducts,
  additionalUsers,
  generateComments,
} from './seed-data';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('123', 10);

  // Create admin and default customer
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

  // Create additional users
  const createdUsers = await Promise.all(
    additionalUsers.map(async (user) => {
      return prisma.user.upsert({
        where: { email: user.email },
        update: {},
        create: {
          ...user,
          password: hashedPassword,
          role: Role.CUSTOMER,
        },
      });
    }),
  );

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
      const createdProduct = await prisma.product.create({
        data: product,
      });

      // Add comments for each product
      const allUsers = [customer, ...createdUsers];
      for (const user of allUsers) {
        const comments = generateComments(createdProduct.id, user.id);
        for (const comment of comments) {
          await prisma.comment.create({
            data: comment,
          });
        }
      }
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
