import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

function AdminSidebar({ open = false, onNavigate }) {
  const location = useLocation();
  const role = useSelector((s) => s.auth.user?.role) || localStorage.getItem('role');

  const allLinks = [
    { name: 'Dashboard', path: '/admin', roles: ['Admin', 'Receptionist', 'Barber'] },
    { name: 'Appointments', path: '/admin/appointments', roles: ['Admin', 'Receptionist', 'Barber'] },
    { name: 'Staff', path: '/admin/staff', roles: ['Admin', 'Receptionist'] },
    { name: 'Wages', path: '/admin/wages', roles: ['Admin', 'Barber'] },
    { name: 'Services', path: '/admin/services', roles: ['Admin'] },
    { name: 'Inventory', path: '/admin/inventory', roles: ['Admin'] },
    { name: 'Products', path: '/admin/products', roles: ['Admin'] },
    { name: 'Orders', path: '/admin/orders', roles: ['Admin'] },
    { name: 'Analytics', path: '/admin/analytics', roles: ['Admin'] },
  ];

  const links = allLinks.filter((l) => l.roles.includes(role));

  const isActive = (path) => {
    if (path === '/admin') return location.pathname === '/admin';
    return location.pathname.startsWith(path);
  };

  return (
    <aside className={`admin-sidebar ${open ? 'open' : ''}`}>
      <nav className="admin-nav">
        {links.map((link) => (
          <Link
            key={link.name}
            to={link.path}
            className={`admin-nav-link ${isActive(link.path) ? 'active' : ''}`}
            onClick={onNavigate}
          >
            {link.name}
          </Link>
        ))}
      </nav>
    </aside>
  );
}

export default AdminSidebar;
