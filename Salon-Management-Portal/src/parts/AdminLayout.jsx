import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import AdminHeader from './AdminHeader';
import AdminSidebar from './AdminSidebar';
import AdminFooter from './AdminFooter';

function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="admin-shell">
      <AdminHeader onMenuClick={() => setSidebarOpen((v) => !v)} />
      <div className="admin-body">
        {sidebarOpen && (
          <button
            type="button"
            className="admin-overlay"
            aria-label="Close menu"
            onClick={() => setSidebarOpen(false)}
          />
        )}
        <AdminSidebar open={sidebarOpen} onNavigate={() => setSidebarOpen(false)} />
        <div className="admin-content">
          <main className="admin-main">
            <Outlet />
          </main>
          <AdminFooter />
        </div>
      </div>
    </div>
  );
}

export default AdminLayout;
