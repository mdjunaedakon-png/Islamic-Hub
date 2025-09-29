import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Order from '@/models/Order';
import { getCurrentUser } from '@/lib/auth';

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const user = await getCurrentUser();
  if (!user || (user as any).role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  await connectDB();
  const body = await request.json();
  const allowed = ['pending', 'paid', 'shipped', 'delivered', 'cancelled'];
  if (body.status && !allowed.includes(body.status)) return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
  const updated = await Order.findByIdAndUpdate(params.id, { status: body.status }, { new: true });
  if (!updated) return NextResponse.json({ error: 'Order not found' }, { status: 404 });
  return NextResponse.json({ order: updated });
}
