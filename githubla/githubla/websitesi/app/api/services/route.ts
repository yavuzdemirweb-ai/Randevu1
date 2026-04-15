import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const services = await prisma.service.findMany({
      include: {
        category: true,
      },
      orderBy: {
        price: 'asc',
      },
    });

    return NextResponse.json(services);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Hizmetler alınamadı.' }, { status: 500 });
  }
}
