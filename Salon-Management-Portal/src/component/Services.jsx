import { useEffect, useState } from 'react';
import '../css/Services.css';
import { Link } from 'react-router-dom';
import { getServices, getServiceCategories } from '../services/serviceService';
import { LoadingSpinner, PageHeader, EmptyState, inputClass, btnPrimary } from './common/ui';

function Services() {
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: '',
    search: '',
    maxPrice: '',
    maxDuration: '',
  });

  useEffect(() => {
    getServiceCategories()
      .then((res) => setCategories(res.data || res.categories || []))
      .catch(() => {});
  }, []);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const params = {};
        if (filters.category) params.category = filters.category;
        if (filters.search) params.search = filters.search;
        if (filters.maxPrice) params.maxPrice = filters.maxPrice;
        if (filters.maxDuration) params.maxDuration = filters.maxDuration;
        const res = await getServices(params);
        setServices(res.data || []);
      } catch {
        setServices([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [filters]);

  return (
    <div className="public-page-wrap">
      <PageHeader
        title="Our Services"
        subtitle="Browse treatments by category, price, and duration"
      />

      <div className="service-filter-bar">
        <input
          className={inputClass()}
          placeholder="Search services..."
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
        <input
          type="number"
          className={inputClass()}
          placeholder="Max price ($)"
          value={filters.maxPrice}
          onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
        />
        <input
          type="number"
          className={inputClass()}
          placeholder="Max duration (min)"
          value={filters.maxDuration}
          onChange={(e) => setFilters({ ...filters, maxDuration: e.target.value })}
        />
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : services.length === 0 ? (
        <EmptyState message="No services match your filters" />
      ) : (
        <div className="service-list-grid">
          {services.map((svc) => (
            <div key={svc._id} className="service-item-card">
              <span className="service-item-category">{svc.category}</span>
              <h3 className="service-item-title">{svc.name}</h3>
              <p className="service-item-desc">{svc.description || 'Professional salon service.'}</p>
              <div className="service-item-footer">
                <div>
                  <p className="service-item-price">${Number(svc.price).toFixed(2)}</p>
                  <p className="service-item-duration">{svc.duration} min</p>
                </div>
                <Link to="/bookappointment" state={{ serviceId: svc._id }} className={btnPrimary()}>
                  Book
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Services;
