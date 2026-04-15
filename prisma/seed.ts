// prisma/seed.ts
import { PrismaClient } from "@prisma/client";
import bcryptjs from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const serviceCategories = [
    { name: "Saç Hizmetleri" },
    { name: "Sakal Hizmetleri" },
    { name: "Cilt Bakım" },
    { name: "Paketler" },
  ];

  const createdCategories: Record<string, string> = {};

  for (const cat of serviceCategories) {
    const category = await prisma.serviceCategory.upsert({
      where: { name: cat.name },
      update: {},
      create: cat,
    });
    createdCategories[cat.name] = category.id;
  }

  const services = [
    { name: "Saç Kesimi", category: "Saç Hizmetleri", price: 300, duration: 45, description: "Profesyonel saç kesimi ve şekillendirme" },
    { name: "Saç Boyama", category: "Saç Hizmetleri", price: 400, duration: 120, description: "Yüksek kaliteli saç boyama hizmetleri" },
    { name: "Saç Bakımı & Masaj", category: "Saç Hizmetleri", price: 200, duration: 60, description: "Cilt uyumlu saç bakımı ve rahatlatan masaj" },
    { name: "Sakal Tasarımı", category: "Sakal Hizmetleri", price: 150, duration: 30, description: "Profesyonel sakal tasarımı ve şekillendirme" },
    { name: "Sakal Bakımı", category: "Sakal Hizmetleri", price: 100, duration: 20, description: "Sakal yağı ve bakım ürünleri ile uygulaması" },
    { name: "Cilt Bakım & Peeling", category: "Cilt Bakım", price: 250, duration: 50, description: "Doğal peeling ve cilt bakım maskesi" },
    { name: "Yüz Masajı", category: "Cilt Bakım", price: 180, duration: 30, description: "Rahatlatıcı yüz masajı" },
    { name: "VIP Paket", category: "Paketler", price: 600, duration: 150, description: "Kesim + Boyama + Masaj + Cilt Bakımı" },
  ];

  for (const service of services) {
    const { category, ...rest } = service;
    await prisma.service.upsert({
      where: { name_categoryId: { name: service.name, categoryId: createdCategories[category] } },
      update: {},
      create: {
        ...rest,
        categoryId: createdCategories[category],
      },
    });
  }
  
  // Create an admin user
  const hashedAdminPassword = await bcryptjs.hash("admin123", 10);
  await prisma.admin.upsert({
    where: { username: "admin" },
    update: {},
    create: {
      username: "admin",
      password: hashedAdminPassword,
    },
  });

  // Create a sample user
  const hashedUserPassword = await bcryptjs.hash("user123", 10);
  await prisma.user.upsert({
    where: { email: "user@example.com" },
    update: {},
    create: {
      email: "user@example.com",
      password: hashedUserPassword,
      name: "Örnek Kullanıcı",
      phone: "05551234567",
    },
  });

  console.log("✅ Seed data başarıyla oluşturuldu.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
