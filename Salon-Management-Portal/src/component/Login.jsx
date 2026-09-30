import { useState } from 'react';
import '../css/Login.css';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { loginService } from '../services/authService';
import { setCredentials } from '../store/authSlice';

function Login() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const onSubmit = async (data) => {
    setError('');
    setLoading(true);
    try {
      const response = await loginService(data);
      dispatch(setCredentials({ token: response.token, user: response.user }));
      const from = location.state?.from?.pathname;
      if (['Admin', 'Receptionist', 'Barber'].includes(response.user.role)) {
        navigate(from?.startsWith('/admin') ? from : '/admin');
      } else {
        navigate(from && !from.startsWith('/admin') ? from : '/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to log in. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-layout">
      <div className="auth-card">
        <h2 className="auth-title">Welcome Back</h2>
        <p className="auth-subtitle">Sign in to Salon Management Portal</p>

        <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
          <div className="form-group">
            <label htmlFor="email" className="form-label">Email</label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              className="form-input"
              {...register('email', { required: 'Email is required' })}
            />
            {errors.email && <p className="form-error">{errors.email.message}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              id="password"
              type="password"
              placeholder="Enter password"
              className="form-input"
              {...register('password', { required: 'Password is required' })}
            />
            {errors.password && <p className="form-error">{errors.password.message}</p>}
          </div>

          {error && <p className="alert-error">{error}</p>}

          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? 'Signing in...' : 'Login'}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            <Link to="/forgot-password" className="auth-link">Forgot password?</Link>
          </p>
          <p>
            Don&apos;t have an account? <Link to="/register" className="auth-link">Register</Link>
          </p>
          <p>
            <Link to="/" className="back-link">← Back to home</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
