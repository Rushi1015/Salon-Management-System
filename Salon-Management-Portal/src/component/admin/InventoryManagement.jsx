import { useEffect, useState } from 'react';
import {
  getInventory,
  getLowStock,
  createInventoryItem,
  updateInventoryItem,
  restockItem,
  deleteInventoryItem,
} from '../../services/inventoryService';
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
  itemName: '',
  category: 'Shampoo',
  currentStock: 0,
  minimumStock: 10,
  costPerUnit: 0,
  supplier: '',
};

function InventoryManagement() {
  const role = localStorage.getItem('role') || '';
  const isAdmin = role === 'Admin';

  const [items, setItems] = useState([]);
  const [lowStock, setLowStock] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [restockTarget, setRestockTarget] = useState(null);
  const [restockQty, setRestockQty] = useState(1);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const [invRes, lowRes] = await Promise.all([getInventory(), getLowStock()]);
      setItems(invRes.data || invRes || []);
      setLowStock(lowRes.data || lowRes || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load inventory');
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
        <EmptyState message="Inventory management is available to Admins only" />
      </div>
    );
  }

  const isLow = (item) =>
    item.isLowStock === true || Number(item.currentStock) < Number(item.minimumStock ?? item.lowStockThreshold ?? 10);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEdit = (item) => {
    setEditing(item);
    setForm({
      itemName: item.itemName || item.name || '',
      category: item.category || 'Shampoo',
      currentStock: item.currentStock ?? 0,
      minimumStock: item.minimumStock ?? item.lowStockThreshold ?? 10,
      costPerUnit: item.costPerUnit ?? 0,
      supplier: typeof item.supplier === 'object' ? item.supplier?.name || '' : item.supplier || '',
    });
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        itemName: form.itemName,
        category: form.category,
        currentStock: Number(form.currentStock),
        minimumStock: Number(form.minimumStock),
        costPerUnit: Number(form.costPerUnit),
        supplier: { name: form.supplier },
      };
      if (editing) {
        await updateInventoryItem(editing._id, payload);
      } else {
        await createInventoryItem(payload);
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
    if (!window.confirm('Delete this inventory item?')) return;
    try {
      await deleteInventoryItem(id);
      load();
    } catch (err) {
      alert(err.response?.data?.message || 'Delete failed');
    }
  };

  const handleRestock = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await restockItem(restockTarget._id, Number(restockQty));
      setRestockTarget(null);
      setRestockQty(1);
      load();
    } catch (err) {
      alert(err.response?.data?.message || 'Restock failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="Inventory Management"
        subtitle={
          lowStock.length > 0
            ? `${lowStock.length} item(s) below low-stock threshold`
            : 'Track salon supplies and restock levels'
        }
        action={
          <button type="button" className={btnPrimary()} onClick={openCreate}>
            Add Item
          </button>
        }
      />

      {error && <p className="alert-error" style={{ marginBottom: '1rem' }}>{error}</p>}

      {loading ? (
        <LoadingSpinner />
      ) : items.length === 0 ? (
        <EmptyState message="No inventory items" />
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Item</th>
                <th>Category</th>
                <th>Stock</th>
                <th>Threshold</th>
                <th>Cost/Unit</th>
                <th>Supplier</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => {
                const low = isLow(item);
                return (
                  <tr key={item._id} style={low ? { backgroundColor: '#fef2f2' } : {}}>
                    <td style={{ fontWeight: '500', color: 'var(--color-gray-900)' }}>
                      {item.itemName || item.name}
                      {low && (
                        <span className="admin-badge" style={{ marginLeft: '0.5rem', backgroundColor: '#fee2e2', color: '#b91c1c' }}>
                          Low Stock
                        </span>
                      )}
                    </td>
                    <td>{item.category || '—'}</td>
                    <td style={{ fontWeight: '600', color: low ? '#b91c1c' : 'var(--color-gray-900)' }}>
                      {item.currentStock}
                    </td>
                    <td>{item.minimumStock ?? item.lowStockThreshold}</td>
                    <td>
                      ${Number(item.costPerUnit || 0).toFixed(2)}
                    </td>
                    <td>
                      {typeof item.supplier === 'object' ? item.supplier?.name || '—' : item.supplier || '—'}
                    </td>
                    <td style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                      <button
                        type="button"
                        className={btnPrimary()}
                        style={{ padding: '0.25rem 0.5rem', marginRight: '0.5rem' }}
                        onClick={() => {
                          setRestockTarget(item);
                          setRestockQty(1);
                        }}
                      >
                        Restock
                      </button>
                      <button type="button" className={btnSecondary()} style={{ padding: '0.25rem 0.5rem', marginRight: '0.5rem' }} onClick={() => openEdit(item)}>
                        Edit
                      </button>
                      <button
                        type="button"
                        className={btnSecondary()}
                        style={{ padding: '0.25rem 0.5rem', color: 'var(--color-red-600)', borderColor: '#fecaca' }}
                        onClick={() => handleDelete(item._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Item' : 'Add Inventory Item'}>
        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div className="form-group">
            <label className="form-label">Item Name</label>
            <input
              className={inputClass()}
              required
              value={form.itemName}
              onChange={(e) => setForm({ ...form, itemName: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Category</label>
            <select
              className={inputClass()}
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
            >
              {['Shampoo', 'Hair Wax', 'Hair Color', 'Face Cream', 'Gel', 'Oil', 'Razor', 'Towel', 'Cape', 'Scissors', 'Other'].map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div className="form-group">
              <label className="form-label">Current Stock</label>
              <input
                type="number"
                min="0"
                className={inputClass()}
                value={form.currentStock}
                onChange={(e) => setForm({ ...form, currentStock: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Low Stock Threshold</label>
              <input
                type="number"
                min="0"
                className={inputClass()}
                value={form.minimumStock}
                onChange={(e) => setForm({ ...form, minimumStock: e.target.value })}
              />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Cost Per Unit</label>
            <input
              type="number"
              min="0"
              step="0.01"
              className={inputClass()}
              value={form.costPerUnit}
              onChange={(e) => setForm({ ...form, costPerUnit: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Supplier</label>
            <input
              className={inputClass()}
              value={form.supplier}
              onChange={(e) => setForm({ ...form, supplier: e.target.value })}
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

      <Modal open={!!restockTarget} onClose={() => setRestockTarget(null)} title="Restock Item">
        <form onSubmit={handleRestock} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <p style={{ fontSize: '0.875rem', color: 'var(--color-gray-600)' }}>
            Restocking <strong>{restockTarget?.itemName || restockTarget?.name}</strong>
            {restockTarget != null && (
              <span style={{ display: 'block', marginTop: '0.25rem' }}>Current stock: {restockTarget.currentStock}</span>
            )}
          </p>
          <div className="form-group">
            <label className="form-label">Quantity to add</label>
            <input
              type="number"
              min="1"
              className={inputClass()}
              required
              value={restockQty}
              onChange={(e) => setRestockQty(e.target.value)}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', paddingTop: '0.5rem' }}>
            <button type="button" className={btnSecondary()} onClick={() => setRestockTarget(null)}>
              Cancel
            </button>
            <button type="submit" className={btnPrimary()} disabled={saving}>
              {saving ? 'Restocking…' : 'Restock'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default InventoryManagement;
