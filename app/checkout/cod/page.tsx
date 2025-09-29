"use client";
import { useState } from 'react';
import { getCart, clearCart, getCartTotal } from '@/lib/cart';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function CodCheckoutPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [notes, setNotes] = useState('');
  const cart = getCart();
  const total = getCartTotal(cart);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const items = cart.map((i) => ({
        productId: i._id,
        name: i.name,
        image: i.image,
        price: i.price,
        quantity: i.quantity,
      }));
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items,
          totalAmount: total,
          paymentMethod: 'cod',
          shippingAddress: { name, phone, address, city, notes },
          status: 'pending',
        }),
      });
      if (!res.ok) throw new Error('Order creation failed');
      clearCart();
      router.push('/checkout/success?method=cod');
    } catch (err: any) {
      toast.error(err.message || 'Failed to place order');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-10">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">Cash on Delivery</h1>
        <form onSubmit={submit} className="card p-6 space-y-4">
          <div>
            <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
            <input className="input-field" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">Phone</label>
              <input className="input-field" value={phone} onChange={(e) => setPhone(e.target.value)} required />
            </div>
            <div>
              <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">City</label>
              <input className="input-field" value={city} onChange={(e) => setCity(e.target.value)} required />
            </div>
          </div>
          <div>
            <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">Address</label>
            <textarea className="input-field" rows={3} value={address} onChange={(e) => setAddress(e.target.value)} required />
          </div>
          <div>
            <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">Notes (optional)</label>
            <textarea className="input-field" rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} />
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
            <span className="text-gray-600 dark:text-gray-400">Order Total</span>
            <span className="text-lg font-semibold">${total.toFixed(2)}</span>
          </div>

          <button type="submit" className="btn-primary w-full mt-2">Confirm Order</button>
        </form>
      </div>
    </div>
  );
}
