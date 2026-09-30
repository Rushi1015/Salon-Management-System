import { useEffect, useState } from 'react';
import {
  getAllAppointments,
  getBarberAppointments,
  updateAppointmentStatus,
  assignBarber,
} from '../../services/appointmentService';
import { getBarbers } from '../../services/userService';
import {
  StatusBadge,
  LoadingSpinner,
  PageHeader,
  EmptyState,
  inputClass,
  btnSecondary,
} from '../common/ui';

const STATUSES = ['Pending', 'Confirmed', 'In Progress', 'Completed', 'Cancelled'];

function AppointmentAdmin() {
  const role = localStorage.getItem('role') || '';
  const isBarber = role === 'Barber';
  const canAssign = role === 'Admin' || role === 'Receptionist';

  const [appointments, setAppointments] = useState([]);
  const [barbers, setBarbers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const params = statusFilter ? { status: statusFilter } : {};
      const res = isBarber ? await getBarberAppointments(params) : await getAllAppointments(params);
      setAppointments(res.data || res || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load appointments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [statusFilter, isBarber]);

  useEffect(() => {
    if (!canAssign) return;
    getBarbers()
      .then((res) => setBarbers(res.data || res || []))
      .catch(() => setBarbers([]));
  }, [canAssign]);

  const handleStatus = async (id, status) => {
    try {
      await updateAppointmentStatus(id, status);
      load();
    } catch (err) {
      alert(err.response?.data?.message || 'Status update failed');
    }
  };

  const handleAssign = async (id, barberId) => {
    if (!barberId) return;
    try {
      await assignBarber(id, barberId);
      load();
    } catch (err) {
      alert(err.response?.data?.message || 'Assign failed');
    }
  };

  return (
    <div>
      <PageHeader
        title="Appointments"
        subtitle={isBarber ? 'Your assigned appointments' : 'Manage salon appointments'}
      />

      <div style={{ marginBottom: '1rem' }}>
        <select className={inputClass()} style={{ maxWidth: '20rem' }} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="">All statuses</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      {error && <p className="alert-error" style={{ marginBottom: '1rem' }}>{error}</p>}

      {loading ? (
        <LoadingSpinner />
      ) : appointments.length === 0 ? (
        <EmptyState message="No appointments found" />
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Date & Time</th>
                <th>Customer</th>
                <th>Service</th>
                <th>Barber</th>
                <th>Status</th>
                <th>Update</th>
                {canAssign && (
                  <th>Assign Barber</th>
                )}
              </tr>
            </thead>
            <tbody>
              {appointments.map((a) => (
                <tr key={a._id}>
                  <td>
                    {a.date ? new Date(a.date).toLocaleDateString() : '—'} {a.timeSlot || ''}
                  </td>
                  <td>
                    {a.customer?.name || a.customerName || 'Walk-in'}
                  </td>
                  <td>{a.service?.name || a.serviceName || '—'}</td>
                  <td>
                    {a.barber?.name || a.barberName || 'Unassigned'}
                  </td>
                  <td>
                    <StatusBadge status={a.status} />
                  </td>
                  <td>
                    <select
                      className={inputClass()}
                      style={{ padding: '0.25rem 0.5rem', minWidth: '140px' }}
                      value={a.status}
                      onChange={(e) => handleStatus(a._id, e.target.value)}
                    >
                      {STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </td>
                  {canAssign && (
                    <td>
                      <select
                        className={inputClass()}
                        style={{ padding: '0.25rem 0.5rem', minWidth: '140px' }}
                        value={a.barber?._id || a.barber || ''}
                        onChange={(e) => handleAssign(a._id, e.target.value)}
                      >
                        <option value="">Select barber</option>
                        {barbers.map((b) => (
                          <option key={b._id} value={b._id}>
                            {b.name}
                          </option>
                        ))}
                      </select>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!loading && appointments.length > 0 && (
        <div style={{ marginTop: '1rem' }}>
          <button type="button" className={btnSecondary()} onClick={load}>
            Refresh
          </button>
        </div>
      )}
    </div>
  );
}

export default AppointmentAdmin;
