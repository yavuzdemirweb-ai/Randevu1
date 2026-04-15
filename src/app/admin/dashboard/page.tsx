// src/app/admin/dashboard/page.tsx
import prisma from "@/lib/prisma";
import AdminDashboardClient from "./AdminDashboardClient";

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
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

  const serializedAppointments = appointments.map((apt) => ({
    ...apt,
    date: apt.date.toISOString(),
  }));

  return <AdminDashboardClient appointments={serializedAppointments} />;
}
