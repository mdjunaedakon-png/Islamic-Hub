import { NextRequest, NextResponse } from 'next/server';
import { createBkashPayment, fetchAccessToken, getBkashConfig } from '@/lib/bkash';
import { getCurrentUser } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

    const { amount, invoiceId } = await request.json();
    if (!amount || !invoiceId) return NextResponse.json({ error: 'Missing amount or invoiceId' }, { status: 400 });

    const cfg = getBkashConfig();
    if (!cfg) return NextResponse.json({ error: 'bKash is not configured' }, { status: 500 });

    const token = await fetchAccessToken(cfg);
    const { bkashURL, paymentID } = await createBkashPayment(cfg, token, amount, invoiceId);

    return NextResponse.json({ redirectURL: bkashURL, paymentID });
  } catch (error) {
    console.error('bKash create error:', error);
    return NextResponse.json({ error: 'Failed to create payment' }, { status: 500 });
  }
}

