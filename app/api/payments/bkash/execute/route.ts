import { NextRequest, NextResponse } from 'next/server';
import { getBkashConfig } from '@/lib/bkash';

export async function POST(request: NextRequest) {
  try {
    const { paymentID, idToken } = await request.json();
    if (!paymentID || !idToken) return NextResponse.json({ error: 'Missing paymentID or idToken' }, { status: 400 });
    const cfg = getBkashConfig();
    if (!cfg) return NextResponse.json({ error: 'bKash is not configured' }, { status: 500 });

    const res = await fetch(`${cfg.baseUrl}/checkout/payment/execute/${paymentID}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', authorization: idToken, 'x-app-key': cfg.appKey },
    });
    const data = await res.json();
    if (!res.ok) return NextResponse.json({ error: 'Execute failed', details: data }, { status: 500 });
    return NextResponse.json(data);
  } catch (error) {
    console.error('bKash execute error:', error);
    return NextResponse.json({ error: 'Failed to execute payment' }, { status: 500 });
  }
}
