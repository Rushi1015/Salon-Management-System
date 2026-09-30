import { useEffect, useState } from 'react';
import '../css/AppointmentHistory.css';
import { getMyAppointments, cancelAppointment, rescheduleAppointment, getAvailableSlots } from '../services/appointmentService';
import { LoadingSpinner, PageHeader, StatusBadge, EmptyState, Modal, inputClass, btnPrimary, btnSecondary } from './common/ui';

function AppointmentHistory() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [error, setError] = useState('');
  const [rescheduleTarget, setRescheduleTarget] = useState(null);
  const [newDate, setNewDate] = useState('');
  const [newSlot, setNewSlot] = useState('');
  const [slots, setSlots] = useState([]);

  const load = async () => {
    setLoading(true);
    try {
      const params = filter ? { status: filter } : {};
      const res = await getMyAppointments(params);
      setAppointments(res.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load appointments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [filter]);

  useEffect(() => {
    if (!rescheduleTarget || !newDate) return;
    getAvailableSlots(rescheduleTarget.barber?._id || rescheduleTarget.barber, newDate)
      .then((res) => setSlots(res.data || []))
      .catch(() => setSlots([]));
  }, [rescheduleTarget, newDate]);

  const handleCancel = async (id) => {
    if (!window.confirm('Cancel this appointment?')) return;
    try {
      await cancelAppointment(id, 'Cancelled by customer');
      load();
    } catch (err) {
      alert(err.response?.data?.message || 'Cancel failed');
    }
  };

  const handleReschedule = async () => {
    try {
      await rescheduleAppointment(rescheduleTarget._id, { date: newDate, timeSlot: newSlot });
      setRescheduleTarget(null);
      load();
    } catch (err) {
      alert(err.response?.data?.message || 'Reschedule failed');
    }
  };

  return (
    <div className="appt-history-wrap">
      <PageHeader title="My Appointments" subtitle="View, cancel, or reschedule your bookings" />

      <div className="appt-filter-bar">
        <select className={inputClass('appt-filter-select')} value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="">All statuses</option>
          {['Pending', 'Confirmed', 'In Progress', 'Completed', 'Cancelled'].map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      {error && <p className="appt-error">{error}</p>}
      {loading ? (
        <LoadingSpinner />
      ) : appointments.length === 0 ? (
        <EmptyState message="No appointments found" />
      ) : (
        <div className="appt-list">
          {appointments.map((a) => (
            <div key={a._id} className="appt-card">
              <div className="appt-card-info">
                <div className="appt-card-name-row">
                  <p className="appt-card-name">{a.service?.name}</p>
                  <StatusBadge status={a.status} />
                </div>
                <p className="appt-card-barber">with {a.barber?.name}</p>
                <p className="appt-card-datetime">{a.date} · {a.timeSlot}</p>
                <p className="appt-card-amount">${Number(a.totalAmount || 0).toFixed(2)}</p>
              </div>
              {!['Cancelled', 'Completed'].includes(a.status) && (
                <div className="appt-card-actions">
                  <button
                    type="button"
                    className={btnSecondary()}
                    onClick={() => {
                      setRescheduleTarget(a);
                      setNewDate(a.date);
                      setNewSlot('');
                    }}
                  >
                    Reschedule
                  </button>
                  <button type="button" className="appt-btn-cancel" onClick={() => handleCancel(a._id)}>
                    Cancel
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <Modal open={!!rescheduleTarget} onClose={() => setRescheduleTarget(null)} title="Reschedule Appointment">
        <div className="appt-modal-body">
          <div>
            <label className="appt-modal-label">New Date</label>
            <input type="date" className={inputClass()} value={newDate} min={new Date().toISOString().split('T')[0]} onChange={(e) => setNewDate(e.target.value)} />
          </div>
          <div className="appt-slot-grid">
            {slots.filter((s) => s.available).map((s) => (
              <button
                key={s.time}
                type="button"
                onClick={() => setNewSlot(s.time)}
                className={`appt-slot-btn${newSlot === s.time ? ' selected' : ''}`}
              >
                {s.time}
              </button>
            ))}
          </div>
          <button type="button" className={btnPrimary('w-full')} disabled={!newDate || !newSlot} onClick={handleReschedule}>
            Save Changes
          </button>
        </div>
      </Modal>
    </div>
  );
}

export default AppointmentHistory;
