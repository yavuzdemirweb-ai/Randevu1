import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json({ error: 'Randevu id gerekli.' }, { status: 400 });
    }

    const appointment = await prisma.appointment.findUnique({
      where: { id },
    });

    if (!appointment) {
      return NextResponse.json({ error: 'Randevu bulunamadı.' }, { status: 404 });
    }

    if (appointment.status === 'CANCELLED') {
      return NextResponse.json({ error: 'Randevu zaten iptal edilmiş.' }, { status: 400 });
    }

    const updated = await prisma.appointment.update({
      where: { id },
      data: { status: 'CANCELLED' },
      include: {
        services: {
          include: {
            service: true,
          },
        },
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Cancel appointment error:', error);
    return NextResponse.json({ error: 'Randevu iptal edilirken bir hata oluştu.' }, { status: 500 });
  }
}
