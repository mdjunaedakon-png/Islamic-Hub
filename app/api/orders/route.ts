import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Order from '@/models/Order';
import { getCurrentUser } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    await connectDB();
    const body = await request.json();
    const order = await Order.create({
      user: (user as any).id,
      items: body.items,
      total: body.total,
      paymentMethod: body.paymentMethod,
      status: body.paymentMethod === 'cod' ? 'pending' : 'paid',
      shipping: body.shipping,
    });
    return NextResponse.json({ order });
  } catch (e) {
    console.error('Create order error', e);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    await connectDB();
    const orders = await Order.find({ user: (user as any).id }).sort({ createdAt: -1 });
    return NextResponse.json({ orders });
  } catch (e) {
    console.error('List orders error', e);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}
