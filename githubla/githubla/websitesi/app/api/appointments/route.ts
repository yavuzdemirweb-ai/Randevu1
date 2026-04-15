import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const appointments = await prisma.appointment.findMany({
      include: {
        services: {
          include: {
            service: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(appointments);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Randevular alınamadı.' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { customerName, customerEmail, customerPhone, date, notes, serviceIds } = await req.json();

    if (!customerName || !customerEmail || !customerPhone || !date || !serviceIds?.length) {
      return NextResponse.json({ error: 'Eksik bilgiler var.' }, { status: 400 });
    }

    const services = await prisma.service.findMany({
      where: {
        id: { in: serviceIds },
      },
    });

    const subtotal = services.reduce((sum: number, service: { price: number }) => sum + service.price, 0);
    const tax = parseFloat((subtotal * 0.18).toFixed(2));
    const totalAmount = parseFloat((subtotal + tax).toFixed(2));

    const appointment = await prisma.appointment.create({
      data: {
        customerName,
        customerEmail,
        customerPhone,
        date: new Date(date),
        notes,
        subtotal,
        tax,
        totalAmount,
        services: {
          create: services.map((service) => ({
            serviceId: service.id,
            quantity: 1,
            price: service.price,
          })),
        },
      },
      include: {
        services: {
          include: {
            service: true,
          },
        },
      },
    });

    return NextResponse.json(appointment);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Randevu kaydedilemedi.' }, { status: 500 });
  }
}
