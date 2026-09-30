import { useEffect, useState } from 'react';
import { getAllOrders, updateOrderStatus } from '../../services/orderService';
import {
  StatusBadge,
  LoadingSpinner,
  PageHeader,
  EmptyState,
  inputClass,
} from '../common/ui';

const ORDER_STATUSES = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

function OrdersAdmin() {
  const role = localStorage.getItem('role') || '';
  const isAdmin = role === 'Admin';

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const params = statusFilter ? { status: statusFilter } : {};
      const res = await getAllOrders(params);
      setOrders(res.data || res || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) load();
  }, [statusFilter, isAdmin]);

  if (!isAdmin) {
    return (
      <div>
        <EmptyState message="Order management is available to Admins only" />
      </div>
    );
  }

  const handleStatus = async (id, status) => {
    try {
      await updateOrderStatus(id, status);
      load();
    } catch (err) {
      alert(err.response?.data?.message || 'Status update failed');
    }
  };

  return (
    <div>
      <PageHeader title="Orders" subtitle="View and update customer product orders" />

      <div style={{ marginBottom: '1rem' }}>
        <select className={inputClass()} style={{ maxWidth: '20rem' }} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="">All statuses</option>
          {ORDER_STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      {error && <p className="alert-error" style={{ marginBottom: '1rem' }}>{error}</p>}

      {loading ? (
        <LoadingSpinner />
      ) : orders.length === 0 ? (
        <EmptyState message="No orders found" />
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order</th>
                <th>Customer</th>
                <th>Items</th>
                <th>Total</th>
                <th>Date</th>
                <th>Status</th>
                <th>Update</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o._id}>
                  <td style={{ fontFamily: 'monospace', color: 'var(--color-gray-700)' }}>
                    {o.orderNumber || o._id?.slice(-8)}
                  </td>
                  <td style={{ fontWeight: '500', color: 'var(--color-gray-900)' }}>
                    {o.customer?.name || o.user?.name || o.customerName || '—'}
                  </td>
                  <td>
                    {o.items?.length ?? o.products?.length ?? 0}
                  </td>
                  <td style={{ fontWeight: '600', color: 'var(--color-gray-900)' }}>
                    ${Number(o.total || o.totalAmount || 0).toFixed(2)}
                  </td>
                  <td>
                    {o.createdAt ? new Date(o.createdAt).toLocaleDateString() : '—'}
                  </td>
                  <td>
                    <StatusBadge status={o.status || 'Pending'} />
                  </td>
                  <td>
                    <select
                      className={inputClass()}
                      style={{ padding: '0.25rem 0.5rem', minWidth: '130px' }}
                      value={o.status || 'Pending'}
                      onChange={(e) => handleStatus(o._id, e.target.value)}
                    >
                      {ORDER_STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default OrdersAdmin;
