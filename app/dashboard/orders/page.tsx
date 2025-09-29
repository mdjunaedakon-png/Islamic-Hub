"use client";
import { useEffect, useState } from 'react';
import { Package, Filter, RefreshCcw, MapPin, Phone, User as UserIcon } from 'lucide-react';
import toast from 'react-hot-toast';

interface OrderItem { productId: string; name: string; quantity: number; price: number; }
interface ShippingAddress { name: string; phone: string; city: string; address: string; notes?: string; }
interface Order {
  _id: string;
  user: { name?: string; email?: string } | null;
  items?: OrderItem[];
  totalAmount?: number;
  total?: number;
  paymentMethod?: string;
  status?: string;
  shippingAddress?: ShippingAddress;
  shipping?: ShippingAddress; // legacy support
  createdAt: string;
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const load = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (status) params.set('status', status);
      const res = await fetch(`/api/orders/admin?${params.toString()}`);
      const data = await res.json();
      setOrders(data.orders || []);
    } catch {
      toast.error('Failed to load orders');
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, [status]);

  const updateStatus = async (id: string, next: string) => {
    const res = await fetch(`/api/orders/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status: next }) });
    if (!res.ok) { toast.error('Update failed'); return; }
    toast.success('Status updated');
    load();
  };

  const getAddr = (o: Order): ShippingAddress | undefined => {
    return (o.shippingAddress || o.shipping) as any;
  };

  const formatTotal = (o: Order) => {
    const totalValue = typeof o.totalAmount === 'number' ? o.totalAmount : (typeof (o as any).total === 'number' ? (o as any).total : 0);
    return `$${totalValue.toFixed(2)}`;
  };

  const statusBadge = (s?: string) => {
    const base = 'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium';
    switch (s) {
      case 'pending':
        return <span className={`${base} bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-200`}>Pending</span>;
      case 'paid':
        return <span className={`${base} bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200`}>Paid</span>;
      case 'shipped':
        return <span className={`${base} bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-200`}>Shipped</span>;
      case 'delivered':
        return <span className={`${base} bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-200`}>Delivered</span>;
      case 'cancelled':
        return <span className={`${base} bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-200`}>Cancelled</span>;
      default:
        return <span className={`${base} bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300`}>—</span>;
    }
  };

  const methodBadge = (m?: string) => {
    const base = 'inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold uppercase';
    if (m === 'bkash') return <span className={`${base} bg-pink-100 text-pink-700 dark:bg-pink-900/40 dark:text-pink-200`}>bKash</span>;
    if (m === 'cod') return <span className={`${base} bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300`}>COD</span>;
    return <span className={`${base} bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300`}>—</span>;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Package className="w-6 h-6 text-primary-600" /> Manage Orders
            </h1>
            <div className="flex items-center gap-2">
              <button onClick={load} className="btn-secondary flex items-center gap-2"><RefreshCcw className="w-4 h-4"/>Refresh</button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center gap-3 mb-4">
          <Filter className="w-5 h-5 text-gray-500" />
          <select value={status} onChange={(e) => setStatus(e.target.value)} className="input-field max-w-xs">
            <option value="">All statuses</option>
            <option value="pending">Pending</option>
            <option value="paid">Paid</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-gray-600 dark:text-gray-300">
                <th className="text-left px-5 py-3 font-semibold">Date</th>
                <th className="text-left px-5 py-3 font-semibold">Customer</th>
                <th className="text-left px-5 py-3 font-semibold">Shipping</th>
                <th className="text-left px-5 py-3 font-semibold">Items</th>
                <th className="text-left px-5 py-3 font-semibold">Total</th>
                <th className="text-left px-5 py-3 font-semibold">Method</th>
                <th className="text-left px-5 py-3 font-semibold">Status</th>
                <th className="text-left px-5 py-3 font-semibold">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {orders.map((o) => {
                const a = getAddr(o);
                return (
                  <tr key={o._id} className="hover:bg-gray-50/70 dark:hover:bg-gray-700/40 transition-colors">
                    <td className="px-5 py-4 whitespace-nowrap text-gray-700 dark:text-gray-200">{new Date(o.createdAt).toLocaleString()}</td>
                    <td className="px-5 py-4">
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2 text-gray-900 dark:text-white"><UserIcon className="w-4 h-4" /> <span className="font-medium">{a?.name || o.user?.name || '—'}</span></div>
                        <div className="text-xs text-gray-500">{o.user?.email || '—'}</div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="space-y-1 text-xs text-gray-700 dark:text-gray-300">
                        <div className="flex items-center gap-2"><Phone className="w-4 h-4" /> {a?.phone || '—'}</div>
                        <div className="flex items-center gap-2"><MapPin className="w-4 h-4" /> {a?.city || '—'}</div>
                        <div className="text-gray-600 dark:text-gray-300 break-words">{a?.address || '—'}</div>
                        {a?.notes && <div className="text-gray-500 italic">Note: {a.notes}</div>}
                      </div>
                    </td>
                    <td className="px-5 py-4 text-gray-700 dark:text-gray-200">{(o.items || []).map(i => `${i.name} x${i.quantity}`).join(', ')}</td>
                    <td className="px-5 py-4 font-semibold text-gray-900 dark:text-white">{formatTotal(o)}</td>
                    <td className="px-5 py-4">{methodBadge(o.paymentMethod)}</td>
                    <td className="px-5 py-4">{statusBadge(o.status)}</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        {o.status !== 'shipped' && o.status !== 'delivered' && o.status !== 'cancelled' && (
                          <button onClick={() => updateStatus(o._id, 'shipped')} className="btn-secondary px-3 py-1.5 text-xs">Mark Shipped</button>
                        )}
                        {o.status !== 'delivered' && o.status !== 'cancelled' && (
                          <button onClick={() => updateStatus(o._id, 'delivered')} className="btn-primary px-3 py-1.5 text-xs">Mark Delivered</button>
                        )}
                        {o.status !== 'cancelled' && (
                          <button onClick={() => updateStatus(o._id, 'cancelled')} className="btn-secondary px-3 py-1.5 text-xs">Cancel</button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
              {orders.length === 0 && !loading && (
                <tr><td className="px-5 py-10 text-center text-gray-500" colSpan={8}>No orders found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
