import { useEffect, useMemo, useState } from 'react';
import '../css/Store.css';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getProducts, getProductCategories } from '../services/productService';
import { addToCart } from '../store/cartSlice';
import { LoadingSpinner, PageHeader, EmptyState, inputClass, btnPrimary, btnSecondary } from './common/ui';

function Store() {
  const dispatch = useDispatch();
  const totalQuantity = useSelector((s) => s.cart.totalQuantity);

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    sort: '',
  });

  useEffect(() => {
    getProductCategories()
      .then((res) => setCategories(res.data || res.categories || []))
      .catch(() => {});
  }, []);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const params = {};
        if (filters.category) params.category = filters.category;
        if (filters.search) params.search = filters.search;
        const res = await getProducts(params);
        setProducts(res.data || []);
      } catch (err) {
        setProducts([]);
        setError(err.response?.data?.message || 'Failed to load products');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [filters.search, filters.category]);

  const displayed = useMemo(() => {
    let list = [...products];
    if (filters.search) {
      const q = filters.search.toLowerCase();
      list = list.filter(
        (p) =>
          p.name?.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q)
      );
    }
    if (filters.sort === 'price-asc') {
      list.sort((a, b) => Number(a.price) - Number(b.price));
    } else if (filters.sort === 'price-desc') {
      list.sort((a, b) => Number(b.price) - Number(a.price));
    }
    return list;
  }, [products, filters.search, filters.sort]);

  const handleAdd = (product) => {
    dispatch(
      addToCart({
        id: product._id || product.id,
        name: product.name,
        price: Number(product.price),
        image: product.image || '',
      })
    );
  };

  return (
    <div className="public-page-wrap">
      <PageHeader
        title="Store"
        subtitle="Shop salon products and essentials"
        action={
          <Link to="/cart" className={btnPrimary()} style={{ position: 'relative' }}>
            Cart
            {totalQuantity > 0 && (
              <span style={{ position: 'absolute', top: '-0.5rem', right: '-0.5rem', backgroundColor: 'var(--color-red-600)', color: 'white', fontSize: '0.75rem', fontWeight: 'bold', borderRadius: '9999px', height: '1.25rem', minWidth: '1.25rem', padding: '0 0.25rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {totalQuantity}
              </span>
            )}
          </Link>
        }
      />

      <div className="service-filter-bar" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
        <input
          className={inputClass()}
          placeholder="Search products..."
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
        />
        <select
          className={inputClass()}
          value={filters.category}
          onChange={(e) => setFilters({ ...filters, category: e.target.value })}
        >
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <select
          className={inputClass()}
          value={filters.sort}
          onChange={(e) => setFilters({ ...filters, sort: e.target.value })}
        >
          <option value="">Sort by</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
        </select>
      </div>

      {error && <p className="alert-error" style={{ marginBottom: '1rem' }}>{error}</p>}

      {loading ? (
        <LoadingSpinner />
      ) : displayed.length === 0 ? (
        <EmptyState message="No products match your filters" />
      ) : (
        <div className="service-list-grid">
          {displayed.map((product) => (
            <div
              key={product._id || product.id}
              className="service-item-card"
              style={{ padding: '0', overflow: 'hidden' }}
            >
              {product.image ? (
                <img
                  src={product.image}
                  alt={product.name}
                  className="product-item-image"
                />
              ) : (
                <div className="product-item-no-image">
                  No image
                </div>
              )}
              <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                {product.category && (
                  <span className="service-item-category">
                    {product.category}
                  </span>
                )}
                <h3 className="service-item-title">{product.name}</h3>
                <p className="service-item-desc">
                  {product.description || 'Salon product'}
                </p>
                <div className="service-item-footer">
                  <p className="service-item-price">
                    ${Number(product.price).toFixed(2)}
                  </p>
                  <button
                    type="button"
                    className={btnSecondary()}
                    onClick={() => handleAdd(product)}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Store;
