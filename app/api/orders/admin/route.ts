import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Order from '@/models/Order';
import { getCurrentUser } from '@/lib/auth';

export async function GET(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user || (user as any).role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  await connectDB();
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '20');
  const status = searchParams.get('status') || undefined;
  const filter: any = {};
  if (status) filter.status = status;
  const [orders, total] = await Promise.all([
    Order.find(filter)
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit),
    Order.countDocuments(filter),
  ]);
  return NextResponse.json({ orders, pagination: { page, pages: Math.ceil(total / limit), total } });
}
