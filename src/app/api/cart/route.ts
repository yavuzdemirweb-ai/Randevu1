// src/app/api/cart/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

// GET Cart items
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'userId required' }, { status: 400 });
    }

    let cart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            service: {
              include: {
                category: true,
              },
            },
          },
        },
      },
    });

    // If cart doesn't exist, create one
    if (!cart) {
      cart = await prisma.cart.create({
        data: {
          userId,
          items: {},
        },
        include: {
          items: {
            include: {
              service: {
                include: {
                  category: true,
                },
              },
            },
          },
        },
      });
    }

    // Calculate totals
    const subtotal = cart.items.reduce(
      (acc, item) => acc + item.service.price * item.quantity,
      0
    );
    const tax = subtotal * 0.18; // 18% KDV
    const total = subtotal + tax;

    return NextResponse.json({
      cart,
      summary: { subtotal, tax, total },
    });
  } catch (error) {
    console.error('Error fetching cart:', error);
    return NextResponse.json(
      { error: 'Failed to fetch cart' },
      { status: 500 }
    );
  }
}

// POST Add to cart
export async function POST(req: Request) {
  try {
    const { userId, serviceId, quantity = 1 } = await req.json();

    if (!userId || !serviceId) {
      return NextResponse.json(
        { error: 'userId and serviceId required' },
        { status: 400 }
      );
    }

    // Get or create cart
    let cart = await prisma.cart.findUnique({
      where: { userId },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId },
      });
    }

    // Add or update cart item
    const cartItem = await prisma.cartItem.upsert({
      where: {
        cartId_serviceId: {
          cartId: cart.id,
          serviceId,
        },
      },
      update: {
        quantity: {
          increment: quantity,
        },
      },
      create: {
        cartId: cart.id,
        serviceId,
        quantity,
      },
      include: {
        service: true,
      },
    });

    return NextResponse.json(cartItem);
  } catch (error) {
    console.error('Error adding to cart:', error);
    return NextResponse.json(
      { error: 'Failed to add to cart' },
      { status: 500 }
    );
  }
}

// DELETE Remove from cart
export async function DELETE(req: Request) {
  try {
    const { userId, serviceId } = await req.json();

    if (!userId || !serviceId) {
      return NextResponse.json(
        { error: 'userId and serviceId required' },
        { status: 400 }
      );
    }

    const cart = await prisma.cart.findUnique({
      where: { userId },
    });

    if (!cart) {
      return NextResponse.json({ error: 'Cart not found' }, { status: 404 });
    }

    await prisma.cartItem.delete({
      where: {
        cartId_serviceId: {
          cartId: cart.id,
          serviceId,
        },
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error removing from cart:', error);
    return NextResponse.json(
      { error: 'Failed to remove from cart' },
      { status: 500 }
    );
  }
}
