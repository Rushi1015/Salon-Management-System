import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/authSlice';
import logo from '../assets/logo1.png';

function Header() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((s) => s.auth);
  const cartQty = useSelector((s) => s.cart.totalQuantity);
  const isStaff = ['Admin', 'Receptionist', 'Barber'].includes(user?.role);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <div className="public-header">
      <img 
        className="header-logo" 
        src={logo} 
        alt="Salon Logo" 
        onClick={() => navigate('/')} 
      />

      <ul className="nav-list">
        <li>
          <Link to="/" className="nav-link">Home</Link>
        </li>
        <li>
          <Link to="/services" className="nav-link">Services</Link>
        </li>
        <li>
          <Link to="/bookappointment" className="nav-link">Book</Link>
        </li>
        {isAuthenticated && !isStaff && (
          <>
            <li>
              <Link to="/appointments" className="nav-link">Appointments</Link>
            </li>
            <li>
              <Link to="/orders" className="nav-link">Orders</Link>
            </li>
          </>
        )}
        <li>
          <Link to="/about" className="nav-link">About</Link>
        </li>
        <li>
          <Link to="/contact" className="nav-link">Contact</Link>
        </li>
        <li>
          <Link to="/store" className="nav-link">Store</Link>
        </li>
        <li>
          <Link to="/cart" className="nav-link">
            Cart{cartQty > 0 ? ` (${cartQty})` : ''}
          </Link>
        </li>
        {isAuthenticated && !isStaff && (
          <li>
            <Link to="/profile" className="nav-link">Profile</Link>
          </li>
        )}
        {isAuthenticated && isStaff && (
          <li>
            <Link to="/admin" className="nav-link">Portal</Link>
          </li>
        )}
      </ul>
      
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {isAuthenticated ? (
          <button 
            type="button" 
            onClick={handleLogout} 
            className="btn-header"
          >
            Logout
          </button>
        ) : (
          <button 
            type="button" 
            onClick={() => navigate('/login')} 
            className="btn-header"
          >
            Login
          </button>
        )}
      </div>
    </div>
  );
}

export default Header;
