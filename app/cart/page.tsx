"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getCart, updateQuantity, removeFromCart, clearCart, getCartTotal } from '@/lib/cart';
import { ShoppingCart, Trash2, Plus, Minus } from 'lucide-react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
 
 export default function CartPage() {
   const [items, setItems] = useState(getCart());
   const [paymentMethod, setPaymentMethod] = useState<'bkash' | 'cod'>('bkash');
   const router = useRouter();
 
   useEffect(() => {
     const handler = () => setItems(getCart());
     window.addEventListener('cart:updated', handler);
     return () => window.removeEventListener('cart:updated', handler);
   }, []);
 
   const total = getCartTotal();
 
   if (items.length === 0) {
     return (
       <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
         <div className="text-center">
           <ShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
           <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">Your cart is empty</h1>
           <Link href="/products" className="btn-primary">Browse Products</Link>
         </div>
       </div>
     );
   }
 
   return (
     <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-10">
       <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
         <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">Your Cart</h1>
         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
           <div className="lg:col-span-2 space-y-4">
             {items.map((item) => (
               <div key={item.productId} className="card p-4 flex items-center gap-4">
                 <Image src={item.image} alt={item.name} width={80} height={80} className="w-20 h-20 object-cover rounded" />
                 <div className="flex-1">
                   <div className="font-medium text-gray-900 dark:text-white">{item.name}</div>
                   <div className="text-sm text-gray-500 dark:text-gray-400">${item.price.toFixed(2)}</div>
                 </div>
                 <div className="flex items-center gap-2">
                   <button onClick={() => { updateQuantity(item.productId, item.quantity - 1); setItems(getCart()); }} className="p-2 rounded bg-gray-100 dark:bg-gray-800"><Minus className="w-4 h-4" /></button>
                   <span className="w-10 text-center">{item.quantity}</span>
                   <button onClick={() => { updateQuantity(item.productId, item.quantity + 1); setItems(getCart()); }} className="p-2 rounded bg-gray-100 dark:bg-gray-800"><Plus className="w-4 h-4" /></button>
                 </div>
                 <div className="w-24 text-right font-medium">${(item.price * item.quantity).toFixed(2)}</div>
                 <button onClick={() => { removeFromCart(item.productId); setItems(getCart()); }} className="p-2 text-red-600 hover:bg-red-50 rounded"><Trash2 className="w-4 h-4" /></button>
               </div>
             ))}
           </div>
 
           <div className="card p-4 h-fit">
             <div className="flex items-center justify-between mb-2">
               <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
               <span className="font-semibold text-gray-900 dark:text-white">${total.toFixed(2)}</span>
             </div>

            {/* Payment method selector */}
            <div className="mt-3 space-y-2">
              <div className="text-sm font-medium text-gray-700 dark:text-gray-300">Payment Method</div>
              <label className="flex items-center gap-2 p-2 rounded-lg border border-gray-200 dark:border-gray-700 cursor-pointer">
                <input
                  type="radio"
                  name="payment"
                  value="bkash"
                  checked={paymentMethod === 'bkash'}
                  onChange={() => setPaymentMethod('bkash')}
                />
                <span>bKash (Online)</span>
              </label>
              <label className="flex items-center gap-2 p-2 rounded-lg border border-gray-200 dark:border-gray-700 cursor-pointer">
                <input
                  type="radio"
                  name="payment"
                  value="cod"
                  checked={paymentMethod === 'cod'}
                  onChange={() => setPaymentMethod('cod')}
                />
                <span>Cash on Delivery</span>
              </label>
            </div>

             <button
               className="btn-primary w-full mt-4"
               onClick={async () => {
                 if (paymentMethod === 'cod') {
                   router.push('/checkout/cod');
                   return;
                 }
                 // Online (bKash)
                 try {
                   const amount = total.toFixed(2);
                   const invoiceId = `CART-${Date.now()}`;
                   const res = await fetch('/api/payments/bkash/create', {
                     method: 'POST',
                     headers: { 'Content-Type': 'application/json' },
                     body: JSON.stringify({ amount, invoiceId })
                   });
                   const data = await res.json();
                   if (!res.ok || !data.redirectURL) {
                     throw new Error(data.error || 'Payment initialization failed');
                   }
                   window.location.href = data.redirectURL;
                 } catch (e: any) {
                   toast.error(e.message || 'Checkout failed');
                 }
               }}
             >
              {paymentMethod === 'cod' ? 'Place Order (Cash on Delivery)' : 'Proceed to Checkout'}
            </button>
            <button onClick={() => { clearCart(); setItems([]); }} className="btn-secondary w-full mt-2">Clear Cart</button>
          </div>
        </div>
      </div>
    </div>
  );
}
