const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    await prisma.project.upsert({
      where: { id: 'default' },
      update: {},
      create: {
        id: 'default',
        title: 'Основной проект',
      },
    });
    console.log('Default project ensured');
  } catch (e) {
    console.error(e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
