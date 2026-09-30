import { useEffect, useState } from 'react';
import { getProducts, createProduct, updateProduct, deleteProduct } from '../../services/productService';
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
  brand: '',
  stockQuantity: '',
  description: '',
};

function ProductsAdmin() {
  const role = localStorage.getItem('role') || '';
  const isAdmin = role === 'Admin';

  const [products, setProducts] = useState([]);
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
      const res = await getProducts();
      setProducts(res.data || res || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load products');
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
        <EmptyState message="Product management is available to Admins only" />
      </div>
    );
  }

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEdit = (p) => {
    setEditing(p);
    setForm({
      name: p.name || '',
      category: p.category || '',
      price: p.price ?? '',
      brand: p.brand || '',
      stockQuantity: p.stockQuantity ?? p.stock ?? '',
      description: p.description || '',
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
        brand: form.brand,
        stockQuantity: Number(form.stockQuantity),
        description: form.description,
      };
      if (editing) {
        await updateProduct(editing._id, payload);
      } else {
        await createProduct(payload);
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
    if (!window.confirm('Delete this product?')) return;
    try {
      await deleteProduct(id);
      load();
    } catch (err) {
      alert(err.response?.data?.message || 'Delete failed');
    }
  };

  return (
    <div>
      <PageHeader
        title="Products"
        subtitle="Manage retail product catalog"
        action={
          <button type="button" className={btnPrimary()} onClick={openCreate}>
            Add Product
          </button>
        }
      />

      {error && <p className="alert-error" style={{ marginBottom: '1rem' }}>{error}</p>}

      {loading ? (
        <LoadingSpinner />
      ) : products.length === 0 ? (
        <EmptyState message="No products found" />
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Brand</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Description</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p._id}>
                  <td style={{ fontWeight: '500', color: 'var(--color-gray-900)' }}>{p.name}</td>
                  <td>{p.brand || '—'}</td>
                  <td>{p.category || '—'}</td>
                  <td>${Number(p.price || 0).toFixed(2)}</td>
                  <td>{p.stockQuantity ?? p.stock ?? 0}</td>
                  <td style={{ maxWidth: '16rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.description || '—'}</td>
                  <td style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                    <button type="button" className={btnSecondary()} style={{ padding: '0.25rem 0.5rem', marginRight: '0.5rem' }} onClick={() => openEdit(p)}>
                      Edit
                    </button>
                    <button
                      type="button"
                      className={btnSecondary()}
                      style={{ padding: '0.25rem 0.5rem', color: 'var(--color-red-600)', borderColor: '#fecaca' }}
                      onClick={() => handleDelete(p._id)}
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

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Product' : 'Add Product'}>
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
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div className="form-group">
              <label className="form-label">Category</label>
              <input
                className={inputClass()}
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Brand</label>
              <input
                className={inputClass()}
                value={form.brand}
                onChange={(e) => setForm({ ...form, brand: e.target.value })}
              />
            </div>
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
              <label className="form-label">Stock Quantity</label>
              <input
                type="number"
                min="0"
                className={inputClass()}
                required
                value={form.stockQuantity}
                onChange={(e) => setForm({ ...form, stockQuantity: e.target.value })}
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

export default ProductsAdmin;
