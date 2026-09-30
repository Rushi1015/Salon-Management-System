import { useEffect, useState } from 'react';
import {
  getWageRecords,
  getMyEarnings,
  getMonthlySummary,
  updateCommissionRate,
  createWageRecord,
  updateWageStatus,
} from '../../services/wageService';
import { getAllStaff } from '../../services/staffService';
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

function WageManagement() {
  const role = localStorage.getItem('role') || '';
  const isAdmin = role === 'Admin';
  const isBarber = role === 'Barber';

  const [records, setRecords] = useState([]);
  const [summary, setSummary] = useState(null);
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [commissionModal, setCommissionModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    barberId: '',
    serviceAmount: '',
    commissionRate: '',
    notes: '',
  });
  const [commissionForm, setCommissionForm] = useState({ barberId: '', commissionRate: '' });

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      if (isBarber) {
        const [earnRes, sumRes] = await Promise.all([getMyEarnings(), getMonthlySummary()]);
        const rawRecords = earnRes.data || earnRes.records || earnRes || [];
        setRecords(Array.isArray(rawRecords) ? rawRecords : []);
        // earnRes includes summary at top-level
        const earnSummary = earnRes.summary || null;
        // sumRes.data is an array of monthly aggregates — sum them all
        const monthlyArr = sumRes.data || sumRes || [];
        const computedSummary = Array.isArray(monthlyArr)
          ? monthlyArr.reduce(
              (acc, m) => ({
                totalEarnings: acc.totalEarnings + (m.totalEarnings || 0),
                totalCommission: acc.totalCommission + (m.totalCommission || 0),
                totalServices: acc.totalServices + (m.totalServices || 0),
              }),
              { totalEarnings: 0, totalCommission: 0, totalServices: 0 }
            )
          : null;
        setSummary(earnSummary || computedSummary);
      } else if (isAdmin) {
        const [wageRes, sumRes, staffRes] = await Promise.all([
          getWageRecords(),
          getMonthlySummary(),
          getAllStaff({ role: 'Barber' }),
        ]);
        const rawRecords = wageRes.data || wageRes || [];
        setRecords(Array.isArray(rawRecords) ? rawRecords : []);
        // sumRes.data is an array of monthly aggregates — sum them all
        const monthlyArr = sumRes.data || sumRes || [];
        const computedSummary = Array.isArray(monthlyArr)
          ? monthlyArr.reduce(
              (acc, m) => ({
                totalEarnings: acc.totalEarnings + (m.totalEarnings || 0),
                totalCommission: acc.totalCommission + (m.totalCommission || 0),
                totalServices: acc.totalServices + (m.totalServices || 0),
              }),
              { totalEarnings: 0, totalCommission: 0, totalServices: 0 }
            )
          : null;
        setSummary(computedSummary);
        const staffList = staffRes.data || staffRes || [];
        setStaff(staffList.filter((s) => (s.role || s.user?.role) === 'Barber' || !s.role));
      } else {
        setError('Wage management is available to Admin and Barber roles');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load wage data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [isAdmin, isBarber]);

  const totalServices =
    summary?.totalServices ?? summary?.serviceCount ?? records.length;
  const totalEarnings =
    summary?.totalEarnings ?? summary?.totalCommission ?? summary?.earnings ?? 0;
  const commissionPct =
    summary?.commissionRate ?? summary?.avgCommissionRate ?? summary?.commissionPercent ?? null;

  const handleCreate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await createWageRecord({
        barberId: form.barberId,
        serviceAmount: Number(form.serviceAmount),
        commissionRate: form.commissionRate ? Number(form.commissionRate) : undefined,
        notes: form.notes,
      });
      setModalOpen(false);
      setForm({ barberId: '', serviceAmount: '', commissionRate: '', notes: '' });
      load();
    } catch (err) {
      alert(err.response?.data?.message || 'Create failed');
    } finally {
      setSaving(false);
    }
  };

  const handleCommission = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateCommissionRate(commissionForm.barberId, Number(commissionForm.commissionRate));
      setCommissionModal(false);
      setCommissionForm({ barberId: '', commissionRate: '' });
      load();
    } catch (err) {
      alert(err.response?.data?.message || 'Commission update failed');
    } finally {
      setSaving(false);
    }
  };

  const handleStatus = async (id, status) => {
    try {
      await updateWageStatus(id, status);
      load();
    } catch (err) {
      alert(err.response?.data?.message || 'Status update failed');
    }
  };

  if (!isAdmin && !isBarber) {
    return (
      <div>
        <EmptyState message="Wage management is available to Admin and Barber roles" />
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title={isBarber ? 'My Earnings' : 'Wage Management'}
        subtitle={isBarber ? 'Your commission and service earnings' : 'Staff wages and commissions'}
        action={
          isAdmin ? (
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button type="button" className={btnSecondary()} onClick={() => setCommissionModal(true)}>
                Set Commission
              </button>
              <button type="button" className={btnPrimary()} onClick={() => setModalOpen(true)}>
                Add Wage Record
              </button>
            </div>
          ) : null
        }
      />

      {error && <p className="alert-error" style={{ marginBottom: '1rem' }}>{error}</p>}

      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          <div className="admin-stat-grid">
            <div className="admin-stat-card">
              <div style={{ padding: '0.5rem' }}>
                <p className="admin-stat-label">Total Services</p>
                <h3 className="admin-stat-value">{totalServices}</h3>
              </div>
            </div>
            <div className="admin-stat-card">
              <div style={{ padding: '0.5rem' }}>
                <p className="admin-stat-label">Total Earnings</p>
                <h3 className="admin-stat-value">
                  ${Number(totalEarnings || 0).toFixed(2)}
                </h3>
              </div>
            </div>
            <div className="admin-stat-card">
              <div style={{ padding: '0.5rem' }}>
                <p className="admin-stat-label">Commission %</p>
                <h3 className="admin-stat-value">
                  {commissionPct != null ? `${commissionPct}%` : '—'}
                </h3>
              </div>
            </div>
          </div>

          {records.length === 0 ? (
            <EmptyState message="No wage records found" />
          ) : (
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    {!isBarber && (
                      <th>Barber</th>
                    )}
                    <th>Date</th>
                    <th>Service Amount</th>
                    <th>Commission</th>
                    <th>Earnings</th>
                    <th>Status</th>
                    {isAdmin && (
                      <th style={{ textAlign: 'right' }}>Actions</th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {records.map((r) => (
                    <tr key={r._id}>
                      {!isBarber && (
                        <td style={{ fontWeight: '500', color: 'var(--color-gray-900)' }}>
                          {r.barber?.name || r.staff?.name || r.barberName || '—'}
                        </td>
                      )}
                      <td>
                        {r.date || r.createdAt
                          ? new Date(r.date || r.createdAt).toLocaleDateString()
                          : '—'}
                      </td>
                      <td>
                        ${Number(r.serviceAmount || r.amount || 0).toFixed(2)}
                      </td>
                      <td>
                        {r.commissionRate != null ? `${r.commissionRate}%` : '—'}
                      </td>
                      <td style={{ fontWeight: '600', color: 'var(--color-gray-900)' }}>
                        ${Number(r.totalEarning ?? r.earnings ?? r.commission ?? r.totalEarnings ?? 0).toFixed(2)}
                      </td>
                      <td>
                        <StatusBadge status={r.status || 'Unpaid'} />
                      </td>
                      {isAdmin && (
                        <td style={{ textAlign: 'right' }}>
                          <select
                            className={inputClass()}
                            style={{ padding: '0.25rem 0.5rem', maxWidth: '120px', marginLeft: 'auto' }}
                            value={r.status || 'Unpaid'}
                            onChange={(e) => handleStatus(r._id, e.target.value)}
                          >
                            {['Unpaid', 'Paid', 'Pending'].map((s) => (
                              <option key={s} value={s}>
                                {s}
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
        </>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Create Wage Record">
        <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div className="form-group">
            <label className="form-label">Barber</label>
            <select
              className={inputClass()}
              required
              value={form.barberId}
              onChange={(e) => setForm({ ...form, barberId: e.target.value })}
            >
              <option value="">Select barber</option>
              {staff.map((s) => (
                <option key={s._id} value={s._id}>
                  {s.name || s.user?.name}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Service Amount</label>
            <input
              type="number"
              min="0"
              step="0.01"
              className={inputClass()}
              required
              value={form.serviceAmount}
              onChange={(e) => setForm({ ...form, serviceAmount: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Commission Rate (%) — optional</label>
            <input
              type="number"
              min="0"
              max="100"
              className={inputClass()}
              value={form.commissionRate}
              onChange={(e) => setForm({ ...form, commissionRate: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Notes</label>
            <input
              className={inputClass()}
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', paddingTop: '0.5rem' }}>
            <button type="button" className={btnSecondary()} onClick={() => setModalOpen(false)}>
              Cancel
            </button>
            <button type="submit" className={btnPrimary()} disabled={saving}>
              {saving ? 'Saving…' : 'Create'}
            </button>
          </div>
        </form>
      </Modal>

      <Modal open={commissionModal} onClose={() => setCommissionModal(false)} title="Update Commission Rate">
        <form onSubmit={handleCommission} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div className="form-group">
            <label className="form-label">Barber</label>
            <select
              className={inputClass()}
              required
              value={commissionForm.barberId}
              onChange={(e) => setCommissionForm({ ...commissionForm, barberId: e.target.value })}
            >
              <option value="">Select barber</option>
              {staff.map((s) => (
                <option key={s._id} value={s._id}>
                  {s.name || s.user?.name}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Commission Rate (%)</label>
            <input
              type="number"
              min="0"
              max="100"
              className={inputClass()}
              required
              value={commissionForm.commissionRate}
              onChange={(e) => setCommissionForm({ ...commissionForm, commissionRate: e.target.value })}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', paddingTop: '0.5rem' }}>
            <button type="button" className={btnSecondary()} onClick={() => setCommissionModal(false)}>
              Cancel
            </button>
            <button type="submit" className={btnPrimary()} disabled={saving}>
              {saving ? 'Saving…' : 'Update'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default WageManagement;
