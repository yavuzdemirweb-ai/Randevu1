import { PrismaClient } from '@prisma/client';
import bcryptjs from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const categories = [
    { name: 'Saç Hizmetleri' },
    { name: 'Sakal Hizmetleri' },
    { name: 'Cilt & Bakım' },
  ];

  const createdCategories = await Promise.all(
    categories.map((category) =>
      prisma.serviceCategory.upsert({
        where: { name: category.name },
        update: {},
        create: category,
      })
    )
  );

  const services = [
    {
      name: 'Modern Saç Kesimi',
      description: 'Yüz tipine göre şekillendirilmiş modern saç kesimi.',
      price: 350,
      duration: 50,
      image: 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=900&q=80',
      categoryId: createdCategories[0].id,
    },
    {
      name: 'Renkli Saç Boyama',
      description: 'Canlı renk tonlarıyla profesyonel saç boyama.',
      price: 450,
      duration: 120,
      image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=900&q=80',
      categoryId: createdCategories[0].id,
    },
    {
      name: 'Sakal Şekillendirme',
      description: 'Özel kesim ve cilt dostu bakım yağlarıyla sakal tasarımı.',
      price: 180,
      duration: 30,
      image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=80',
      categoryId: createdCategories[1].id,
    },
    {
      name: 'Bakım Paketi',
      description: 'Yüz temizliği, masaj ve nemlendirme içeren bakım paketi.',
      price: 300,
      duration: 60,
      image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=900&q=80',
      categoryId: createdCategories[2].id,
    },
  ];

  for (const service of services) {
    await prisma.service.upsert({
      where: {
        name_categoryId: {
          name: service.name,
          categoryId: service.categoryId,
        },
      },
      update: {},
      create: service,
    });
  }

  const adminPassword = await bcryptjs.hash('admin123', 10);
  await prisma.admin.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      password: adminPassword,
    },
  });

  const userPassword = await bcryptjs.hash('user123', 10);
  await prisma.user.upsert({
    where: { email: 'musteri@yavuzkuafor.com' },
    update: {},
    create: {
      name: 'Müşteri',
      email: 'musteri@yavuzkuafor.com',
      password: userPassword,
      phone: '05551234567',
    },
  });

  console.log('Seed data created successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
