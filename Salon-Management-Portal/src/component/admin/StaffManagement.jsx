import { useEffect, useMemo, useState } from 'react';
import {
  getAllStaff,
  createStaff,
  updateStaff,
  deleteStaff,
  updateShift,
  getAllTimeOffs,
  updateTimeOffStatus,
} from '../../services/staffService';
import {
  StatusBadge,
  LoadingSpinner,
  PageHeader,
  EmptyState,
  Modal,
  inputClass,
  btnPrimary,
  btnSecondary,
} from '../common/ui';

const emptyForm = {
  name: '',
  email: '',
  password: '',
  phone: '',
  role: 'Barber',
  specializations: '',
  commissionRate: 10,
};

function StaffManagement() {
  const role = localStorage.getItem('role') || '';
  const isAdmin = role === 'Admin';
  const canManageTimeOff = role === 'Admin' || role === 'Receptionist';

  const [staff, setStaff] = useState([]);
  const [timeOffs, setTimeOffs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [skillFilter, setSkillFilter] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [shiftModal, setShiftModal] = useState(null);
  const [shiftForm, setShiftForm] = useState({ start: '09:00', end: '17:00', days: '' });

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const params = skillFilter ? { skill: skillFilter } : {};
      const staffRes = await getAllStaff(params);
      setStaff(staffRes.data || staffRes || []);
      if (canManageTimeOff) {
        const toRes = await getAllTimeOffs();
        setTimeOffs(toRes.data || toRes || []);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load staff');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [skillFilter]);

  const allSkills = useMemo(() => {
    const set = new Set();
    staff.forEach((s) => {
      (s.specializations || s.skills || []).forEach((sk) => set.add(sk));
    });
    return Array.from(set).sort();
  }, [staff]);

  const filteredStaff = useMemo(() => {
    if (!skillFilter) return staff;
    const q = skillFilter.toLowerCase();
    return staff.filter((s) =>
      (s.specializations || s.skills || []).some((sk) => String(sk).toLowerCase().includes(q))
    );
  }, [staff, skillFilter]);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEdit = (member) => {
    setEditing(member);
    setForm({
      name: member.name || member.user?.name || '',
      email: member.email || member.user?.email || '',
      password: '',
      phone: member.phone || member.user?.phone || '',
      role: member.role || member.user?.role || 'Barber',
      specializations: (member.specializations || member.skills || []).join(', '),
      commissionRate: member.commissionRate ?? 10,
    });
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        name: form.name,
        email: form.email,
        phone: form.phone,
        role: form.role,
        specializations: form.specializations
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean),
        commissionRate: Number(form.commissionRate),
      };
      if (!editing && form.password) payload.password = form.password;
      if (editing) {
        await updateStaff(editing._id, payload);
      } else {
        await createStaff(payload);
      }
      setModalOpen(false);
      load();
    } catch (err) {
      alert(err.response?.data?.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this staff member?')) return;
    try {
      await deleteStaff(id);
      load();
    } catch (err) {
      alert(err.response?.data?.message || 'Delete failed');
    }
  };

  const openShift = (member) => {
    const wh = member.workingHours || {};
    setShiftModal(member);
    setShiftForm({
      start: wh.start || '09:00',
      end: wh.end || '17:00',
      days: Array.isArray(member.workingDays) ? member.workingDays.join(', ') : '',
    });
  };

  const handleShiftSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateShift(shiftModal._id, {
        workingHours: { start: shiftForm.start, end: shiftForm.end },
        workingDays: shiftForm.days
          .split(',')
          .map((d) => d.trim())
          .filter(Boolean),
      });
      setShiftModal(null);
      load();
    } catch (err) {
      alert(err.response?.data?.message || 'Shift update failed');
    } finally {
      setSaving(false);
    }
  };

  const handleTimeOff = async (id, status) => {
    try {
      await updateTimeOffStatus(id, status);
      load();
    } catch (err) {
      alert(err.response?.data?.message || 'Time-off update failed');
    }
  };

  const formatHours = (member) => {
    const wh = member.workingHours || member.shift;
    if (!wh) return '—';
    const start = wh.start || wh.startTime;
    const end = wh.end || wh.endTime;
    const days = Array.isArray(wh.days) ? wh.days.join(', ') : wh.days;
    if (!start && !end) return '—';
    return `${start || '?'} – ${end || '?'}${days ? ` (${days})` : ''}`;
  };

  return (
    <div>
      <PageHeader
        title="Staff Management"
        subtitle="Manage barbers, receptionists, skills, and shifts"
        action={
          isAdmin ? (
            <button type="button" className={btnPrimary()} onClick={openCreate}>
              Add Staff
            </button>
          ) : null
        }
      />

      <div style={{ marginBottom: '1rem', display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center' }}>
        <input
          className={inputClass()}
          style={{ maxWidth: '20rem' }}
          placeholder="Filter by skill tag…"
          value={skillFilter}
          onChange={(e) => setSkillFilter(e.target.value)}
          list="skill-tags"
        />
        <datalist id="skill-tags">
          {allSkills.map((sk) => (
            <option key={sk} value={sk} />
          ))}
        </datalist>
        {skillFilter && (
          <button type="button" className={btnSecondary()} onClick={() => setSkillFilter('')}>
            Clear
          </button>
        )}
      </div>

      {error && <p className="alert-error" style={{ marginBottom: '1rem' }}>{error}</p>}

      {loading ? (
        <LoadingSpinner />
      ) : filteredStaff.length === 0 ? (
        <EmptyState message="No staff found" />
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Role</th>
                <th>Skills</th>
                <th>Working Hours</th>
                <th>Commission</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStaff.map((member) => {
                const skills = member.specializations || member.skills || [];
                return (
                  <tr key={member._id}>
                    <td>
                      <div style={{ fontWeight: '500', color: 'var(--color-gray-900)' }}>{member.name || member.user?.name}</div>
                      <div style={{ color: 'var(--color-gray-500)', fontSize: '0.75rem', marginTop: '0.25rem' }}>{member.email || member.user?.email}</div>
                    </td>
                    <td>{member.role || member.user?.role}</td>
                    <td>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>
                        {skills.length === 0 ? (
                          <span style={{ color: 'var(--color-gray-400)' }}>—</span>
                        ) : (
                          skills.map((sk) => (
                            <span
                              key={sk}
                              className="admin-badge"
                              style={{ backgroundColor: '#eef2ff', color: '#4338ca', cursor: 'pointer' }}
                              onClick={() => setSkillFilter(sk)}
                            >
                              {sk}
                            </span>
                          ))
                        )}
                      </div>
                    </td>
                    <td>{formatHours(member)}</td>
                    <td>
                      {member.commissionRate != null ? `${member.commissionRate}%` : '—'}
                    </td>
                    <td style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                      {(isAdmin || role === 'Receptionist') && (
                        <button type="button" className={btnSecondary()} style={{ padding: '0.25rem 0.5rem', marginRight: '0.5rem' }} onClick={() => openShift(member)}>
                          Shift
                        </button>
                      )}
                      {isAdmin && (
                        <>
                          <button type="button" className={btnSecondary()} style={{ padding: '0.25rem 0.5rem', marginRight: '0.5rem' }} onClick={() => openEdit(member)}>
                            Edit
                          </button>
                          <button
                            type="button"
                            className={btnSecondary()}
                            style={{ padding: '0.25rem 0.5rem', color: 'var(--color-red-600)', borderColor: '#fecaca' }}
                            onClick={() => handleDelete(member._id)}
                          >
                            Delete
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {canManageTimeOff && (
        <div style={{ marginTop: '2.5rem' }}>
          <h2 className="admin-page-title" style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Time-Off Requests</h2>
          {timeOffs.length === 0 ? (
            <EmptyState message="No time-off requests" />
          ) : (
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Staff</th>
                    <th>Dates</th>
                    <th>Reason</th>
                    <th>Status</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {timeOffs.map((to) => (
                    <tr key={to._id}>
                      <td style={{ fontWeight: '500', color: 'var(--color-gray-900)' }}>
                        {to.staff?.name || to.staffName || to.user?.name || '—'}
                      </td>
                      <td>
                        {to.startDate ? new Date(to.startDate).toLocaleDateString() : '—'}
                        {' – '}
                        {to.endDate ? new Date(to.endDate).toLocaleDateString() : '—'}
                      </td>
                      <td>{to.reason || '—'}</td>
                      <td>
                        <StatusBadge status={to.status || 'Pending'} />
                      </td>
                      <td style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                        {to.status === 'Pending' && (
                          <>
                            <button
                              type="button"
                              className={btnPrimary()}
                              style={{ padding: '0.25rem 0.5rem', marginRight: '0.5rem' }}
                              onClick={() => handleTimeOff(to._id, 'Approved')}
                            >
                              Approve
                            </button>
                            <button
                              type="button"
                              className={btnSecondary()}
                              style={{ padding: '0.25rem 0.5rem', color: 'var(--color-red-600)' }}
                              onClick={() => handleTimeOff(to._id, 'Rejected')}
                            >
                              Reject
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Staff' : 'Create Staff'}>
        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div className="form-group">
            <label className="form-label">Name</label>
            <input className={inputClass()} required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              type="email"
              className={inputClass()}
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>
          {!editing && (
            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                className={inputClass()}
                required
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
            </div>
          )}
          <div className="form-group">
            <label className="form-label">Phone</label>
            <input className={inputClass()} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          </div>
          <div className="form-group">
            <label className="form-label">Role</label>
            <select className={inputClass()} value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
              <option value="Barber">Barber</option>
              <option value="Receptionist">Receptionist</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Specializations (comma-separated)</label>
            <input
              className={inputClass()}
              placeholder="Fade, Beard Trim, Coloring"
              value={form.specializations}
              onChange={(e) => setForm({ ...form, specializations: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Commission Rate (%)</label>
            <input
              type="number"
              min="0"
              max="100"
              className={inputClass()}
              value={form.commissionRate}
              onChange={(e) => setForm({ ...form, commissionRate: e.target.value })}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', paddingTop: '0.5rem' }}>
            <button type="button" className={btnSecondary()} onClick={() => setModalOpen(false)}>
              Cancel
            </button>
            <button type="submit" className={btnPrimary()} disabled={saving}>
              {saving ? 'Saving…' : 'Save'}
            </button>
          </div>
        </form>
      </Modal>

      <Modal open={!!shiftModal} onClose={() => setShiftModal(null)} title="Update Working Hours">
        <form onSubmit={handleShiftSave} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div className="form-group">
              <label className="form-label">Start</label>
              <input
                type="time"
                className={inputClass()}
                value={shiftForm.start}
                onChange={(e) => setShiftForm({ ...shiftForm, start: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">End</label>
              <input
                type="time"
                className={inputClass()}
                value={shiftForm.end}
                onChange={(e) => setShiftForm({ ...shiftForm, end: e.target.value })}
              />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Days (comma-separated)</label>
            <input
              className={inputClass()}
              placeholder="Mon, Tue, Wed, Thu, Fri"
              value={shiftForm.days}
              onChange={(e) => setShiftForm({ ...shiftForm, days: e.target.value })}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', paddingTop: '0.5rem' }}>
            <button type="button" className={btnSecondary()} onClick={() => setShiftModal(null)}>
              Cancel
            </button>
            <button type="submit" className={btnPrimary()} disabled={saving}>
              {saving ? 'Saving…' : 'Update Shift'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default StaffManagement;
