import { NextResponse } from 'next/server';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '@/lib/prisma';

const JWT_SECRET = process.env.JWT_SECRET ?? 'secret';

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Eksik bilgi.' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json({ error: 'Kullanıcı bulunamadı.' }, { status: 404 });
    }

    const valid = await bcryptjs.compare(password, user.password);
    if (!valid) {
      return NextResponse.json({ error: 'Şifre yanlış.' }, { status: 401 });
    }

    const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
    return NextResponse.json({ user: { name: user.name, email: user.email }, token });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Giriş başarısız.' }, { status: 500 });
  }
}
