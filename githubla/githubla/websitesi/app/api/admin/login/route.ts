import { NextResponse } from 'next/server';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '@/lib/prisma';

const JWT_SECRET = process.env.JWT_SECRET ?? 'secret';

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json({ error: 'Eksik bilgi.' }, { status: 400 });
    }

    const admin = await prisma.admin.findUnique({ where: { username } });
    if (!admin) {
      return NextResponse.json({ error: 'Admin bulunamadı.' }, { status: 404 });
    }

    const valid = await bcryptjs.compare(password, admin.password);
    if (!valid) {
      return NextResponse.json({ error: 'Şifre yanlış.' }, { status: 401 });
    }

    const token = jwt.sign({ adminId: admin.id, username: admin.username }, JWT_SECRET, { expiresIn: '7d' });
    return NextResponse.json({ admin: { username: admin.username }, token });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Admin giriş başarısız.' }, { status: 500 });
  }
}
