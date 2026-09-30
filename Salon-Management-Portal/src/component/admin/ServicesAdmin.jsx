import { useEffect, useState } from 'react';
import { getServices, createService, updateService, deleteService } from '../../services/serviceService';
import {
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
  category: '',
  price: '',
  duration: '',
  description: '',
};

function ServicesAdmin() {
  const role = localStorage.getItem('role') || '';
  const isAdmin = role === 'Admin';

  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await getServices();
      setServices(res.data || res || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load services');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) load();
  }, [isAdmin]);

  if (!isAdmin) {
    return (
      <div className="max-w-7xl mx-auto">
        <EmptyState message="Service management is available to Admins only" />
      </div>
    );
  }

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEdit = (svc) => {
    setEditing(svc);
    setForm({
      name: svc.name || '',
      category: svc.category || '',
      price: svc.price ?? '',
      duration: svc.duration ?? '',
      description: svc.description || '',
    });
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        name: form.name,
        category: form.category,
        price: Number(form.price),
        duration: Number(form.duration),
        description: form.description,
      };
      if (editing) {
        await updateService(editing._id, payload);
      } else {
        await createService(payload);
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
    if (!window.confirm('Delete this service?')) return;
    try {
      await deleteService(id);
      load();
    } catch (err) {
      alert(err.response?.data?.message || 'Delete failed');
    }
  };

  return (
    <div>
      <PageHeader
        title="Services"
        subtitle="Manage salon service catalog"
        action={
          <button type="button" className={btnPrimary()} onClick={openCreate}>
            Add Service
          </button>
        }
      />

      {error && <p className="alert-error" style={{ marginBottom: '1rem' }}>{error}</p>}

      {loading ? (
        <LoadingSpinner />
      ) : services.length === 0 ? (
        <EmptyState message="No services found" />
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Duration</th>
                <th>Description</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {services.map((svc) => (
                <tr key={svc._id}>
                  <td style={{ fontWeight: '500', color: 'var(--color-gray-900)' }}>{svc.name}</td>
                  <td>{svc.category || '—'}</td>
                  <td>${Number(svc.price || 0).toFixed(2)}</td>
                  <td>
                    {svc.duration != null ? `${svc.duration} min` : '—'}
                  </td>
                  <td style={{ maxWidth: '16rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{svc.description || '—'}</td>
                  <td style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                    <button type="button" className={btnSecondary()} style={{ padding: '0.25rem 0.5rem', marginRight: '0.5rem' }} onClick={() => openEdit(svc)}>
                      Edit
                    </button>
                    <button
                      type="button"
                      className={btnSecondary()}
                      style={{ padding: '0.25rem 0.5rem', color: 'var(--color-red-600)', borderColor: '#fecaca' }}
                      onClick={() => handleDelete(svc._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Service' : 'Add Service'}>
        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div className="form-group">
            <label className="form-label">Name</label>
            <input
              className={inputClass()}
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Category</label>
            <input
              className={inputClass()}
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
            />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div className="form-group">
              <label className="form-label">Price</label>
              <input
                type="number"
                min="0"
                step="0.01"
                className={inputClass()}
                required
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Duration (min)</label>
              <input
                type="number"
                min="1"
                className={inputClass()}
                required
                value={form.duration}
                onChange={(e) => setForm({ ...form, duration: e.target.value })}
              />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              className={inputClass()}
              rows={3}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
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
    </div>
  );
}

export default ServicesAdmin;
