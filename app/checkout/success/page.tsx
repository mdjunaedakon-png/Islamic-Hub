"use client";
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function CheckoutSuccessPage() {
  const params = useSearchParams();
  const method = params.get('method');
  const isCod = method === 'cod';
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
      <div className="card p-8 text-center max-w-md w-full">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">Order Confirmed</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          {isCod ? 'Your Cash on Delivery order has been placed. Our team will contact you soon.' : 'Payment successful. Thank you for your purchase!'}
        </p>
        <Link href="/products" className="btn-primary">Continue Shopping</Link>
      </div>
    </div>
  );
}
