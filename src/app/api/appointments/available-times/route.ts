// src/app/api/appointments/available-times/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const dateStr = searchParams.get('date');

    if (!dateStr) {
      return NextResponse.json({ error: "Tarih parametresi gerekli." }, { status: 400 });
    }

    const selectedDate = new Date(dateStr);
    
    // Find all appointments for this date
    // We compare just the date part (YYYY-MM-DD)
    const bookedAppointments = await prisma.appointment.findMany({
      where: {
        date: {
          gte: new Date(selectedDate.setHours(0, 0, 0, 0)),
          lt: new Date(selectedDate.setHours(23, 59, 59, 999))
        },
        status: {
          not: "CANCELLED" // Don't block cancelled appointments
        }
      },
      select: {
        time: true
      }
    });

    const bookedTimes = bookedAppointments.map(a => a.time);

    return NextResponse.json({ bookedTimes });
  } catch (error) {
    console.error("Error fetching available times:", error);
    return NextResponse.json({ error: "Dolu saatler getirilemedi." }, { status: 500 });
  }
}
