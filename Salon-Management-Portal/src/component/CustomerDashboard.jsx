import { useEffect, useState } from 'react';
import '../css/CustomerDashboard.css';
import { Link } from 'react-router-dom';
import { getCustomerDashboard } from '../services/adminService';
import { getMyOrders } from '../services/orderService';
import { LoadingSpinner, PageHeader, StatusBadge, EmptyState, btnPrimary } from './common/ui';

function CustomerDashboard() {
  const [data, setData] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const [dash, ord] = await Promise.all([getCustomerDashboard(), getMyOrders()]);
        setData(dash.data);
        setOrders(ord.data || []);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load dashboard');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <LoadingSpinner />;
  if (error) return <p className="text-red-600 p-6">{error}</p>;

  const upcoming = data?.upcomingAppointments || [];
  const history = data?.pastAppointments || [];

  return (
    <div className="public-page-wrap">
      <PageHeader
        title="My Dashboard"
        subtitle="Upcoming visits, history, and purchases"
        action={<Link to="/bookappointment" className={btnPrimary()}>Book Appointment</Link>}
      />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        {[
          { label: 'Upcoming', value: upcoming.length },
          { label: 'Total Visits', value: data?.totalAppointments ?? history.length },
          { label: 'Orders', value: orders.length },
        ].map((c) => (
          <div key={c.label} className="admin-stat-card" style={{ padding: '1.25rem', flexDirection: 'column', alignItems: 'flex-start', gap: '0.5rem' }}>
            <p className="admin-stat-label" style={{ margin: '0' }}>{c.label}</p>
            <p className="admin-stat-value">{c.value}</p>
          </div>
        ))}
      </div>

      <h2 className="admin-page-title" style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Upcoming Appointments</h2>
      {upcoming.length === 0 ? (
        <EmptyState message="No upcoming appointments" />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
          {upcoming.map((a) => (
            <div key={a._id} className="admin-stat-card" style={{ padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <p style={{ fontWeight: '600', color: 'var(--color-gray-800)', marginBottom: '0.25rem' }}>{a.service?.name}</p>
                <p style={{ fontSize: '0.875rem', color: 'var(--color-gray-500)', marginBottom: '0.5rem' }}>with {a.barber?.name}</p>
                <p style={{ fontSize: '0.875rem', color: 'var(--color-primary)', fontWeight: '500' }}>
                  {a.date} · {a.timeSlot}
                </p>
              </div>
              <StatusBadge status={a.status} />
            </div>
          ))}
        </div>
      )}

      <h2 className="admin-page-title" style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Recent Appointments</h2>
      {history.length === 0 ? (
        <EmptyState message="No appointment history yet" />
      ) : (
        <div className="admin-table-wrap" style={{ marginBottom: '2rem' }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Service</th>
                <th>Stylist</th>
                <th>Status</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {history.slice(0, 10).map((a) => (
                <tr key={a._id}>
                  <td>{a.date} {a.timeSlot}</td>
                  <td style={{ fontWeight: '500' }}>{a.service?.name}</td>
                  <td>{a.barber?.name}</td>
                  <td><StatusBadge status={a.status} /></td>
                  <td style={{ fontWeight: '600' }}>${Number(a.totalAmount || a.service?.price || 0).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <h2 className="admin-page-title" style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Purchase History</h2>
      {orders.length === 0 ? (
        <EmptyState message="No product orders yet" />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {orders.slice(0, 5).map((o) => (
            <div key={o._id} className="admin-stat-card" style={{ padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p style={{ fontWeight: '500', color: 'var(--color-gray-800)', marginBottom: '0.25rem' }}>{o.items?.map((i) => i.name).join(', ')}</p>
                <p style={{ fontSize: '0.75rem', color: 'var(--color-gray-500)' }}>{new Date(o.createdAt).toLocaleDateString()}</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <StatusBadge status={o.status} />
                <p style={{ fontWeight: '600', marginTop: '0.25rem' }}>${Number(o.totalAmount).toFixed(2)}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default CustomerDashboard;
