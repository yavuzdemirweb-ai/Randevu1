import { NextResponse } from 'next/server';
import bcryptjs from 'bcryptjs';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { name, email, password, phone } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Eksik bilgi.' }, { status: 400 });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: 'Bu e-posta zaten kayıtlı.' }, { status: 409 });
    }

    const hashed = await bcryptjs.hash(password, 10);
    const user = await prisma.user.create({
      data: { name, email, password: hashed, phone },
    });

    return NextResponse.json({ user: { name: user.name, email: user.email } });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Kayıt yapılamadı.' }, { status: 500 });
  }
}
