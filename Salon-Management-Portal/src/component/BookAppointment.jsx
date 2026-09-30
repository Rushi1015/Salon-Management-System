import { useEffect, useState } from 'react';
import '../css/BookAppointment.css';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getServices } from '../services/serviceService';
import { getBarbers } from '../services/userService';
import { getAvailableSlots, createAppointment } from '../services/appointmentService';
import {
  toggleService, setService, setBarber, setDate, setTimeSlot, setStep, resetBooking,
} from '../store/bookingSlice';
import { LoadingSpinner, PageHeader, btnPrimary, btnSecondary, inputClass } from './common/ui';

const STEPS = ['Service', 'Stylist', 'Date & Time', 'Confirm'];

function BookAppointment() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useSelector((s) => s.auth);
  const booking = useSelector((s) => s.bookingWizard);

  const [services, setServices] = useState([]);
  const [barbers, setBarbers] = useState([]);
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: location } });
      return;
    }
    const load = async () => {
      try {
        const [svcRes, barberRes] = await Promise.all([getServices(), getBarbers()]);
        const svcList = svcRes.data || [];
        setServices(svcList);
        setBarbers(barberRes.data || []);
        if (location.state?.serviceId) {
          const pre = svcList.find((s) => s._id === location.state.serviceId);
          if (pre) {
            dispatch(setService({ id: pre._id, name: pre.name, price: pre.price, duration: pre.duration }));
            dispatch(setStep(1));
          }
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load booking data');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [isAuthenticated, navigate, location, dispatch]);

  useEffect(() => {
    const loadSlots = async () => {
      if (!booking.selectedBarber?.id || !booking.selectedDate) {
        setSlots([]);
        return;
      }
      setSlotsLoading(true);
      try {
        const res = await getAvailableSlots(booking.selectedBarber.id, booking.selectedDate);
        setSlots(res.data || []);
      } catch {
        setSlots([]);
      } finally {
        setSlotsLoading(false);
      }
    };
    loadSlots();
  }, [booking.selectedBarber, booking.selectedDate]);

  const canNext = () => {
    if (booking.currentStep === 0) return booking.selectedServices && booking.selectedServices.length > 0;
    if (booking.currentStep === 1) return !!booking.selectedBarber;
    if (booking.currentStep === 2) return !!booking.selectedDate && !!booking.selectedTimeSlot;
    return true;
  };

  const handleConfirm = async () => {
    setError('');
    setSubmitting(true);
    try {
      let currentTime = booking.selectedTimeSlot;
      for (const svc of booking.selectedServices) {
        await createAppointment({
          service: svc.id,
          barber: booking.selectedBarber.id,
          date: booking.selectedDate,
          timeSlot: currentTime,
          notes,
        });

        const [hours, minutes] = currentTime.split(':').map(Number);
        const endMinutes = hours * 60 + minutes + svc.duration;
        const nextSlotMinutes = Math.ceil(endMinutes / 30) * 30;
        currentTime = `${String(Math.floor(nextSlotMinutes / 60)).padStart(2, '0')}:${String(nextSlotMinutes % 60).padStart(2, '0')}`;
      }
      dispatch(resetBooking());
      navigate('/appointments');
    } catch (err) {
      setError(err.response?.data?.message || 'Booking failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="public-page-wrap">
      <PageHeader title="Book Appointment" subtitle="Complete the wizard to reserve your slot" />

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', overflowX: 'auto' }}>
        {STEPS.map((label, i) => (
          <div
            key={label}
            className={`wizard-step ${
              i === booking.currentStep
                ? 'wizard-step-active'
                : i < booking.currentStep
                  ? 'wizard-step-completed'
                  : 'wizard-step-pending'
            }`}
          >
            {i + 1}. {label}
          </div>
        ))}
      </div>

      {error && <p className="alert-error" style={{ marginBottom: '1rem' }}>{error}</p>}

      <div style={{ backgroundColor: 'var(--color-white)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-gray-200)', boxShadow: 'var(--shadow-sm)', padding: '1.5rem' }}>
        {booking.currentStep === 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '0.75rem' }}>
            {services.map((svc) => (
              <button
                key={svc._id}
                type="button"
                onClick={() => dispatch(toggleService({ id: svc._id, name: svc.name, price: svc.price, duration: svc.duration }))}
                className={`selectable-card ${
                  booking.selectedServices?.some(s => s.id === svc._id) ? 'selectable-card-active' : ''
                }`}
              >
                <p style={{ fontWeight: '600', color: 'var(--color-gray-800)' }}>{svc.name}</p>
                <p style={{ fontSize: '0.75rem', color: 'var(--color-gray-500)', marginTop: '0.25rem' }}>{svc.category} · {svc.duration} min</p>
                <p style={{ color: 'var(--color-primary)', fontWeight: '700', marginTop: '0.5rem' }}>${Number(svc.price).toFixed(2)}</p>
              </button>
            ))}
          </div>
        )}

        {booking.currentStep === 1 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '0.75rem' }}>
            {barbers.map((b) => (
              <button
                key={b._id}
                type="button"
                onClick={() => dispatch(setBarber({ id: b._id, name: b.name }))}
                className={`selectable-card ${
                  booking.selectedBarber?.id === b._id ? 'selectable-card-active' : ''
                }`}
              >
                <p style={{ fontWeight: '600', color: 'var(--color-gray-800)' }}>{b.name}</p>
                <p style={{ fontSize: '0.75rem', color: 'var(--color-gray-500)', marginTop: '0.25rem' }}>
                  {(b.specializations || []).join(', ') || 'Stylist'}
                </p>
              </button>
            ))}
          </div>
        )}

        {booking.currentStep === 2 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label className="form-label">Select Date</label>
              <input
                type="date"
                className={inputClass()}
                style={{ maxWidth: '20rem' }}
                min={new Date().toISOString().split('T')[0]}
                value={booking.selectedDate}
                onChange={(e) => dispatch(setDate(e.target.value))}
              />
            </div>
            {slotsLoading ? (
              <LoadingSpinner />
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))', gap: '0.5rem' }}>
                {slots.map((slot) => (
                  <button
                    key={slot.time}
                    type="button"
                    disabled={!slot.available}
                    onClick={() => dispatch(setTimeSlot(slot.time))}
                    style={{
                      padding: '0.5rem',
                      borderRadius: 'var(--radius-lg)',
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      border: '1px solid',
                      cursor: slot.available ? 'pointer' : 'not-allowed',
                      transition: 'all 0.2s',
                      ...(slot.available
                        ? booking.selectedTimeSlot === slot.time
                          ? { backgroundColor: 'var(--color-primary)', color: 'white', borderColor: 'var(--color-primary)' }
                          : { backgroundColor: 'white', color: 'var(--color-gray-700)', borderColor: 'var(--color-gray-300)' }
                        : { backgroundColor: 'var(--color-gray-100)', color: 'var(--color-gray-400)', borderColor: 'var(--color-gray-200)', textDecoration: 'line-through' })
                    }}
                  >
                    {slot.time}
                  </button>
                ))}
                {!slotsLoading && slots.length === 0 && booking.selectedDate && (
                  <p style={{ gridColumn: '1 / -1', fontSize: '0.875rem', color: 'var(--color-gray-500)' }}>No slots available for this date.</p>
                )}
              </div>
            )}
          </div>
        )}

        {booking.currentStep === 3 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.875rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem' }}>
              <div style={{ backgroundColor: 'var(--color-gray-50)', borderRadius: 'var(--radius-lg)', padding: '1rem' }}>
                <p style={{ color: 'var(--color-gray-500)', marginBottom: '0.5rem' }}>Services</p>
                {booking.selectedServices?.map((s) => (
                  <div key={s.id} style={{ marginBottom: '0.5rem' }}>
                    <p style={{ fontWeight: '600' }}>{s.name}</p>
                    <p>${Number(s.price || 0).toFixed(2)} · {s.duration} min</p>
                  </div>
                ))}
              </div>
              <div style={{ backgroundColor: 'var(--color-gray-50)', borderRadius: 'var(--radius-lg)', padding: '1rem' }}>
                <p style={{ color: 'var(--color-gray-500)', marginBottom: '0.25rem' }}>Stylist</p>
                <p style={{ fontWeight: '600' }}>{booking.selectedBarber?.name}</p>
              </div>
              <div style={{ backgroundColor: 'var(--color-gray-50)', borderRadius: 'var(--radius-lg)', padding: '1rem' }}>
                <p style={{ color: 'var(--color-gray-500)', marginBottom: '0.25rem' }}>Date</p>
                <p style={{ fontWeight: '600' }}>{booking.selectedDate}</p>
              </div>
              <div style={{ backgroundColor: 'var(--color-gray-50)', borderRadius: 'var(--radius-lg)', padding: '1rem' }}>
                <p style={{ color: 'var(--color-gray-500)', marginBottom: '0.25rem' }}>Time</p>
                <p style={{ fontWeight: '600' }}>{booking.selectedTimeSlot}</p>
              </div>
            </div>
            <div>
              <label className="form-label">Notes (optional)</label>
              <textarea className={inputClass()} rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} />
            </div>
          </div>
        )}

        <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'space-between' }}>
          <button
            type="button"
            className={btnSecondary()}
            disabled={booking.currentStep === 0}
            onClick={() => dispatch(setStep(booking.currentStep - 1))}
          >
            Back
          </button>
          {booking.currentStep < 3 ? (
            <button
              type="button"
              className={btnPrimary()}
              disabled={!canNext()}
              onClick={() => dispatch(setStep(booking.currentStep + 1))}
            >
              Next
            </button>
          ) : (
            <button type="button" className={btnPrimary()} disabled={submitting} onClick={handleConfirm}>
              {submitting ? 'Booking...' : 'Confirm Booking'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default BookAppointment;
