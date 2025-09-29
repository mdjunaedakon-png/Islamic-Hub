"use client";
import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

export default function BkashCallbackPage() {
  const search = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<'pending'|'success'|'failed'>('pending');
  const [message, setMessage] = useState('Processing payment...');

  useEffect(() => {
    const paymentID = search.get('paymentID');
    const idToken = search.get('id_token');
    if (!paymentID || !idToken) {
      setStatus('failed');
      setMessage('Missing payment parameters.');
      return;
    }
    const run = async () => {
      try {
        const res = await fetch('/api/payments/bkash/execute', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ paymentID, idToken }) });
        const data = await res.json();
        if (!res.ok || data.transactionStatus === 'Failed') {
          setStatus('failed');
          setMessage('Payment failed.');
          return;
        }
        setStatus('success');
        setMessage('Payment successful. Thank you!');
        setTimeout(() => router.push('/orders'), 2000);
      } catch (e) {
        setStatus('failed');
        setMessage('Payment execution error.');
      }
    };
    run();
  }, [search, router]);

  return (
    <div className="max-w-xl mx-auto p-6 text-center">
      <h1 className="text-2xl font-semibold mb-2">bKash Payment</h1>
      <p className={status === 'success' ? 'text-green-500' : status === 'failed' ? 'text-red-500' : 'text-gray-400'}>{message}</p>
    </div>
  );
}
