import React, { useState, useEffect } from 'react';
import { getOverviewStats, getBarberDashboard, getReceptionistDashboard } from '../../services/adminService';
import { LoadingSpinner } from '../common/ui';

const ICON_COLORS = {
  green: { background: '#dcfce7', color: '#15803d' },
  blue: { background: '#dbeafe', color: '#1d4ed8' },
  yellow: { background: '#fef9c3', color: '#a16207' },
  purple: { background: '#f3e8ff', color: '#7e22ce' },
  indigo: { background: '#e0e7ff', color: '#4338ca' },
  pink: { background: '#fce7f3', color: '#be185d' },
  teal: { background: '#ccfbf1', color: '#0f766e' },
};

function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const role = localStorage.getItem('role') || 'Admin';

  useEffect(() => {
    const fetchStats = async () => {
      try {
        if (role === 'Barber') {
          const response = await getBarberDashboard();
          if (response.success) setStats(response.data);
          else setError('Failed to fetch barber data');
        } else if (role === 'Receptionist') {
          const recRes = await getReceptionistDashboard();
          if (recRes.success) setStats(recRes.data);
          else setError('Failed to fetch receptionist data');
        } else {
          const response = await getOverviewStats();
          if (response.success) setStats(response.data);
          else setError('Failed to fetch dashboard data');
        }
      } catch (err) {
        setError('Error loading dashboard');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [role]);

  if (loading) return <LoadingSpinner />;
  if (error) {
    return <div className="text-red-600 bg-red-50 p-4 rounded-xl">{error}</div>;
  }

  let statCards = [];
  let dashboardTitle = 'Dashboard Overview';

  if (role === 'Barber') {
    dashboardTitle = 'Barber Dashboard';
    statCards = [
      { title: 'Monthly Revenue', value: `$${stats?.monthlyEarnings?.totalEarnings?.toFixed(2) || '0.00'}`, icon: '💰', tone: 'green' },
      { title: 'Upcoming Appointments', value: stats?.upcomingAppointments?.length || 0, icon: '📅', tone: 'blue' },
      { title: 'Completed Services', value: stats?.totalCompleted || 0, icon: '✅', tone: 'purple' },
      { title: 'Commission Earned', value: `$${stats?.monthlyEarnings?.totalCommission?.toFixed(2) || '0.00'}`, icon: '💵', tone: 'indigo' },
    ];
  } else if (role === 'Receptionist') {
    dashboardTitle = 'Receptionist Dashboard';
    statCards = [
      { title: "Today's Appointments", value: stats?.todayCount || 0, icon: '📅', tone: 'blue' },
      { title: 'Pending Appointments', value: stats?.pendingCount || 0, icon: '⏳', tone: 'yellow' },
      { title: 'Available Barbers', value: stats?.availableBarbers?.length || 0, icon: '👨‍💼', tone: 'purple' },
      { title: "Today's Revenue", value: `$${(stats?.todayRevenue || 0).toFixed(2)}`, icon: '💰', tone: 'green' },
    ];
  } else {
    statCards = [
      { title: 'Total Revenue', value: `$${stats?.totalRevenue?.toFixed(2) || '0.00'}`, icon: '💰', tone: 'green' },
      { title: 'Total Customers', value: stats?.totalCustomers || 0, icon: '👥', tone: 'blue' },
      { title: 'Pending Appointments', value: stats?.pendingAppointments || 0, icon: '⏳', tone: 'yellow' },
      { title: "Today's Appointments", value: stats?.todayAppointments || 0, icon: '📅', tone: 'purple' },
      { title: 'Total Orders', value: stats?.totalOrders || 0, icon: '📦', tone: 'indigo' },
      { title: 'Active Services', value: stats?.activeServices || 0, icon: '✂️', tone: 'pink' },
      { title: 'Total Staff', value: stats?.totalStaff || 0, icon: '👨‍💼', tone: 'teal' },
    ];
  }

  return (
    <div>
      <h1 className="admin-page-title">{dashboardTitle}</h1>

      <div className="admin-stat-grid">
        {statCards.map((card) => (
          <div key={card.title} className="admin-stat-card">
            <div className="admin-stat-icon" style={ICON_COLORS[card.tone]}>
              {card.icon}
            </div>
            <div>
              <p className="admin-stat-label">{card.title}</p>
              <h3 className="admin-stat-value">{card.value}</h3>
            </div>
          </div>
        ))}
      </div>

      {role === 'Barber' && stats?.upcomingAppointments?.length > 0 && (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Date & Time</th>
                <th>Customer</th>
                <th>Service</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {stats.upcomingAppointments.map((appt, idx) => (
                <tr key={appt._id || idx}>
                  <td>
                    {new Date(appt.date).toLocaleDateString()} {appt.timeSlot}
                  </td>
                  <td>{appt.customer?.name || 'Walk-in'}</td>
                  <td>{appt.service?.name}</td>
                  <td>
                    <span className="admin-badge">{appt.status}</span>
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

export default AdminDashboard;
