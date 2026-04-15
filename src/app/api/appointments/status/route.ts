import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

const allowedStatuses = ['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'];

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json({ error: 'Randevu id ve durum gerekli.' }, { status: 400 });
    }

    if (!allowedStatuses.includes(status)) {
      return NextResponse.json({ error: 'Geçersiz randevu durumu.' }, { status: 400 });
    }

    const appointment = await prisma.appointment.findUnique({ where: { id } });
    if (!appointment) {
      return NextResponse.json({ error: 'Randevu bulunamadı.' }, { status: 404 });
    }

    const updatedAppointment = await prisma.appointment.update({
      where: { id },
      data: { status },
      include: {
        services: {
          include: {
            service: true,
          },
        },
      },
    });

    return NextResponse.json(updatedAppointment);
  } catch (error) {
    console.error('Appointment status update error:', error);
    return NextResponse.json({ error: 'Randevu durumu güncellenirken hata oluştu.' }, { status: 500 });
  }
}
