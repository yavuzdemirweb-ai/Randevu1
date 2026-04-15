// src/app/api/appointments/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { 
      customerName, 
      customerPhone, 
      date, 
      time, 
      services: serviceIds, 
      customerEmail,
      notes 
    } = body;

    // Validation
    if (!customerName || !customerPhone || !date || !time || !serviceIds?.length) {
      console.error("Missing fields:", { customerName, customerPhone, date, time, serviceIds });
      return NextResponse.json({ error: "Lütfen tüm zorunlu alanları doldurun." }, { status: 400 });
    }

    const appointmentDate = new Date(date);
    
    // Double booking check
    const existingAppointment = await prisma.appointment.findFirst({
      where: {
        date: {
          gte: new Date(appointmentDate.setHours(0, 0, 0, 0)),
          lt: new Date(appointmentDate.setHours(23, 59, 59, 999))
        },
        time: time,
        status: {
          not: "CANCELLED"
        }
      }
    });

    if (existingAppointment) {
      return NextResponse.json({ error: "Bu tarih ve saat için zaten bir randevu bulunuyor. Lütfen başka bir saat seçin." }, { status: 400 });
    }

    // Fetch services to get their current prices
    const servicesData = await prisma.service.findMany({
      where: {
        id: { in: serviceIds }
      }
    });

    if (servicesData.length === 0) {
      return NextResponse.json({ error: "Seçili hizmetler bulunamadı." }, { status: 400 });
    }

    const subtotal = servicesData.reduce((acc, s) => acc + s.price, 0);
    const tax = subtotal * 0.18; // 18% KDV
    const calculatedTotal = subtotal + tax;

    // Use transaction implicitly by creating related records
    const appointment = await prisma.appointment.create({
      data: {
        customerName,
        customerPhone,
        customerEmail: customerEmail || null,
        date: new Date(date),
        time,
        notes: notes || null,
        subtotal,
        tax,
        totalAmount: calculatedTotal,
        services: {
          create: servicesData.map((s) => ({
            service: { connect: { id: s.id } },
            price: s.price,
            quantity: 1
          }))
        }
      },
      include: {
        services: {
          include: {
            service: true
          }
        }
      }
    });

    console.log("Appointment created successfully:", appointment.id);
    return NextResponse.json(appointment);
  } catch (error) {
    console.error("API Error (POST /api/appointments):", error);
    return NextResponse.json({ error: "Randevu oluşturulurken bir hata oluştu." }, { status: 500 });
  }
}

export async function GET() {
  try {
    const appointments = await prisma.appointment.findMany({
      include: {
        services: {
          include: {
            service: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    return NextResponse.json(appointments);
  } catch (error) {
    console.error("API Error (GET /api/appointments):", error);
    return NextResponse.json({ error: "Randevular getirilemedi." }, { status: 500 });
  }
}
