import { useEffect, useState } from 'react';
import {
  LineChart,
  BarChart,
  AreaChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  Line,
  Bar,
} from 'recharts';
import {
  getRevenueAnalytics,
  getUserGrowth,
  getServicePopularity,
  getStaffPerformance,
  getMonthlyAppointments,
  getOverviewStats,
} from '../../services/adminService';
import { LoadingSpinner, PageHeader, EmptyState } from '../common/ui';

function unwrapArray(res) {
  if (!res) return [];
  if (Array.isArray(res)) return res;
  if (Array.isArray(res.data)) return res.data;
  if (Array.isArray(res.results)) return res.results;
  if (res.data && Array.isArray(res.data.data)) return res.data.data;
  return [];
}

function unwrapObject(res) {
  if (!res) return null;
  if (res.data && typeof res.data === 'object' && !Array.isArray(res.data)) return res.data;
  return res;
}

function normalizeRevenue(rows) {
  return rows.map((r) => ({
    month: r.month || r.label || r.period || r.date || '',
    revenue: Number(r.totalRevenue ?? r.revenue ?? r.total ?? r.amount ?? 0),
    appointmentRevenue: Number(r.appointmentRevenue ?? 0),
    orderRevenue: Number(r.orderRevenue ?? 0),
  }));
}

function normalizeGrowth(rows) {
  return rows.map((r) => ({
    month: r.month || r.label || r.period || '',
    users: Number(r.users ?? r.userCount ?? r.total ?? 0),
    customers: Number(r.customers ?? r.customerCount ?? 0),
  }));
}

function normalizeServices(rows) {
  return rows.map((r) => ({
    name: r.serviceName || r.name || r.service || 'Service',
    count: Number(r.count ?? r.bookings ?? r.total ?? 0),
  }));
}

function normalizeStaff(rows) {
  return rows.map((r) => ({
    name: r.barberName || r.name || r.staffName || r.barber || 'Staff',
    completed: Number(r.completedAppointments ?? r.completed ?? r.completedCount ?? r.appointments ?? 0),
    revenue: Number(r.totalRevenue ?? r.revenue ?? r.earnings ?? 0),
  }));
}

function normalizeMonthly(rows) {
  return rows.map((r) => ({
    month: r.month || r.label || r.period || '',
    count: Number(r.count ?? r.appointments ?? r.total ?? 0),
  }));
}

function ChartCard({ title, children }) {
  return (
    <div className="admin-stat-card">
      <h2 className="admin-page-title" style={{ fontSize: '1.25rem', marginBottom: '1rem', padding: '1.25rem 1.25rem 0 1.25rem' }}>{title}</h2>
      <div style={{ height: '18rem', width: '100%', padding: '0 1.25rem 1.25rem 1.25rem' }}>{children}</div>
    </div>
  );
}

function AnalyticsDashboard() {
  const role = localStorage.getItem('role') || '';
  const isAdmin = role === 'Admin';

  const [overview, setOverview] = useState(null);
  const [revenue, setRevenue] = useState([]);
  const [userGrowth, setUserGrowth] = useState([]);
  const [servicePopularity, setServicePopularity] = useState([]);
  const [staffPerformance, setStaffPerformance] = useState([]);
  const [monthlyAppts, setMonthlyAppts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isAdmin) return;
    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const [overRes, revRes, growthRes, svcRes, staffRes, monthlyRes] = await Promise.all([
          getOverviewStats(),
          getRevenueAnalytics(),
          getUserGrowth(),
          getServicePopularity(),
          getStaffPerformance(),
          getMonthlyAppointments(),
        ]);
        setOverview(unwrapObject(overRes));
        // Revenue API returns { data: { monthlyData: [...], totalRevenue, year } }
        const revData = revRes?.data?.monthlyData || revRes?.monthlyData || unwrapArray(revRes);
        setRevenue(normalizeRevenue(revData));
        // User growth API returns { data: { monthlyData: [...] } }
        const growthData = growthRes?.data?.monthlyData || growthRes?.monthlyData || unwrapArray(growthRes);
        setUserGrowth(normalizeGrowth(growthData));
        // Service popularity returns { data: { serviceStats: [...] } }
        const svcData = svcRes?.data?.serviceStats || svcRes?.serviceStats || unwrapArray(svcRes);
        setServicePopularity(normalizeServices(svcData));
        // Staff performance returns { data: [...] }
        const staffData = staffRes?.data || unwrapArray(staffRes);
        setStaffPerformance(normalizeStaff(Array.isArray(staffData) ? staffData : [staffData]));
        // Monthly appointments returns { data: [...] }
        const monthlyData = monthlyRes?.data || unwrapArray(monthlyRes);
        setMonthlyAppts(normalizeMonthly(Array.isArray(monthlyData) ? monthlyData : []));
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load analytics');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [isAdmin]);

  if (!isAdmin) {
    return (
      <div>
        <EmptyState message="Analytics is available to Admins only" />
      </div>
    );
  }

  if (loading) return <LoadingSpinner />;

  const cards = [
    { title: 'Total Revenue', value: `$${Number(overview?.totalRevenue || 0).toFixed(2)}` },
    { title: 'Customers', value: overview?.totalCustomers ?? 0 },
    { title: 'Appointments Today', value: overview?.todayAppointments ?? 0 },
    { title: 'Pending', value: overview?.pendingAppointments ?? 0 },
    { title: 'Orders', value: overview?.totalOrders ?? 0 },
    { title: 'Staff', value: overview?.totalStaff ?? 0 },
  ];

  return (
    <div>
      <PageHeader title="Analytics Dashboard" subtitle="Revenue, growth, and performance insights" />

      {error && <p className="alert-error" style={{ marginBottom: '1rem' }}>{error}</p>}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        {cards.map((c) => (
          <div key={c.title} className="admin-stat-card" style={{ padding: '1rem' }}>
            <p className="admin-stat-label">{c.title}</p>
            <p className="admin-stat-value" style={{ marginTop: '0.25rem' }}>{c.value}</p>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem' }}>
        <ChartCard title="Revenue">
          {revenue.length === 0 ? (
            <EmptyState message="No revenue data" />
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenue}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  name="Revenue"
                  stroke="#2a134a"
                  fill="#2a134a"
                  fillOpacity={0.2}
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </ChartCard>

        <ChartCard title="User Growth">
          {userGrowth.length === 0 ? (
            <EmptyState message="No growth data" />
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={userGrowth}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="users" name="Users" stroke="#2563eb" strokeWidth={2} />
                <Line type="monotone" dataKey="customers" name="Customers" stroke="#16a34a" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </ChartCard>

        <ChartCard title="Service Popularity">
          {servicePopularity.length === 0 ? (
            <EmptyState message="No service data" />
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={servicePopularity}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} interval={0} angle={-20} textAnchor="end" height={60} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" name="Bookings" fill="#7c3aed" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </ChartCard>

        <ChartCard title="Staff Performance">
          {staffPerformance.length === 0 ? (
            <EmptyState message="No staff data" />
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={staffPerformance}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="completed" name="Completed" fill="#0d9488" />
                <Bar dataKey="revenue" name="Revenue" fill="#2a134a" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </ChartCard>

        <ChartCard title="Monthly Appointments">
          {monthlyAppts.length === 0 ? (
            <EmptyState message="No appointment data" />
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyAppts}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="count" name="Appointments" stroke="#ea580c" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </ChartCard>
      </div>
    </div>
  );
}

export default AnalyticsDashboard;
