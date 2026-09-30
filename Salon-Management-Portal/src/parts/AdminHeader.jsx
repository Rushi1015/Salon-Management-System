import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/authSlice';

function AdminHeader({ onMenuClick }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const name = useSelector((s) => s.auth.user?.name) || localStorage.getItem('adminName') || 'Admin';

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <header className="admin-header">
      <div className="admin-header-left">
        <button type="button" className="admin-menu-btn" onClick={onMenuClick} aria-label="Toggle menu">
          ☰
        </button>
        <h1 className="admin-brand" onClick={() => navigate('/admin')}>
          Salon Management Portal
        </h1>
      </div>
      <div className="admin-header-right">
        <span className="admin-welcome">Welcome, <strong>{name}</strong></span>
        <button type="button" className="btn-logout" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </header>
  );
}

export default AdminHeader;
