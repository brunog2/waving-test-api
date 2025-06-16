import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

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

  console.log({ admin, customer });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
