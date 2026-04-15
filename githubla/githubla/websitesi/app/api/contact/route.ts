import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { name, email, message } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Lütfen tüm bilgileri doldurun.' }, { status: 400 });
    }

    await prisma.contactMessage.create({
      data: { name, email, message },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Mesaj gönderilemedi.' }, { status: 500 });
  }
}
