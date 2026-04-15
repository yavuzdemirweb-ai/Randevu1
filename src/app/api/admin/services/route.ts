import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const categories = await prisma.serviceCategory.findMany({
      include: {
        services: {
          include: {
            category: true,
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });

    return NextResponse.json({ categories });
  } catch (error) {
    console.error('Admin services fetch error:', error);
    return NextResponse.json({ error: 'Hizmetler getirilemedi.' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, name, price, categoryId, categoryName } = body;

    if (!id || !name || price == null) {
      return NextResponse.json({ error: 'Hizmet güncellemek için id, isim ve fiyat gereklidir.' }, { status: 400 });
    }

    let categoryConnect;
    if (categoryId) {
      categoryConnect = { connect: { id: categoryId } };
    } else if (categoryName) {
      const category = await prisma.serviceCategory.upsert({
        where: { name: categoryName },
        create: { name: categoryName },
        update: {},
      });
      categoryConnect = { connect: { id: category.id } };
    }

    const updatedService = await prisma.service.update({
      where: { id },
      data: {
        name,
        price: Number(price),
        ...(categoryConnect ? { category: categoryConnect } : {}),
      },
      include: {
        category: true,
      },
    });

    return NextResponse.json({ service: updatedService });
  } catch (error) {
    console.error('Admin service update error:', error);
    return NextResponse.json({ error: 'Hizmet güncellenirken hata oluştu.' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, price, categoryId, categoryName, duration, description, image } = body;

    if (!name || price == null || (!categoryId && !categoryName)) {
      return NextResponse.json({ error: 'Yeni hizmet için isim, fiyat ve kategori tanımlanmalı.' }, { status: 400 });
    }

    let category;
    if (categoryId) {
      category = await prisma.serviceCategory.findUnique({ where: { id: categoryId } });
      if (!category) {
        return NextResponse.json({ error: 'Seçilen kategori bulunamadı.' }, { status: 404 });
      }
    } else {
      category = await prisma.serviceCategory.upsert({
        where: { name: categoryName },
        create: { name: categoryName },
        update: {},
      });
    }

    const newService = await prisma.service.create({
      data: {
        name,
        price: Number(price),
        duration: Number(duration || 30),
        description: description || '',
        image: image || '',
        category: {
          connect: { id: category.id },
        },
      },
      include: {
        category: true,
      },
    });

    return NextResponse.json({ service: newService });
  } catch (error) {
    console.error('Admin create service error:', error);
    return NextResponse.json({ error: 'Hizmet oluşturulurken hata oluştu.' }, { status: 500 });
  }
}
