import { useEffect, useState } from 'react';
import '../css/OrderHistory.css';
import { getMyOrders } from '../services/orderService';
import { LoadingSpinner, PageHeader, StatusBadge, EmptyState, inputClass } from './common/ui';

function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await getMyOrders();
        let data = res.data || [];
        if (filter) {
          data = data.filter(o => o.status === filter);
        }
        setOrders(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load orders');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [filter]);

  return (
    <div className="order-history-wrap">
      <PageHeader title="My Orders" subtitle="View your purchase history and order status" />

      <div className="order-filter-bar">
        <select className={inputClass('order-filter-select')} value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="">All statuses</option>
          {['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      {error && <p className="order-error">{error}</p>}
      
      {loading ? (
        <LoadingSpinner />
      ) : orders.length === 0 ? (
        <EmptyState message="No orders found" />
      ) : (
        <div className="order-list">
          {orders.map((o) => (
            <div key={o._id} className="order-card">
              <div className="order-card-info">
                <div className="order-card-header-row">
                  <p className="order-card-id">Order #{o._id.substring(o._id.length - 8).toUpperCase()}</p>
                </div>
                <p className="order-card-date">Placed on {new Date(o.createdAt).toLocaleDateString()}</p>
                
                <div className="order-items-list">
                  {o.items?.map((item, idx) => (
                    <div key={idx} className="order-item-row">
                      {item.product?.image ? (
                        <img src={item.product.image} alt={item.name} className="order-item-img" />
                      ) : (
                        <div className="order-item-no-img">No Img</div>
                      )}
                      <div className="order-item-details">
                        <span className="order-item-name">{item.name}</span>
                        <span className="order-item-meta">Qty: {item.quantity} · ${Number(item.price).toFixed(2)} each</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="order-card-totals">
                  <span>Payment: {o.paymentMethod}</span>
                  <strong>Total: ${Number(o.totalAmount).toFixed(2)}</strong>
                </div>
              </div>
              
              <div className="order-card-right">
                <StatusBadge status={o.status} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default OrderHistory;
