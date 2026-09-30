import { useState } from 'react';
import '../css/Register.css';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { registerService } from '../services/authService';
import { setCredentials } from '../store/authSlice';

function Register() {
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onSubmit = async (data) => {
    setError('');
    setLoading(true);
    try {
      const { confirmPassword, ...payload } = data;
      payload.role = 'Customer';
      const response = await registerService(payload);
      dispatch(setCredentials({ token: response.token, user: response.user }));
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-layout">
      <div className="auth-card">
        <h2 className="auth-title">Create Account</h2>
        <p className="auth-subtitle">Join Salon Management Portal</p>

        <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input 
              className="form-input"
              {...register('name', { required: 'Name is required' })} 
            />
            {errors.name && <p className="form-error">{errors.name.message}</p>}
          </div>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input 
              type="email" 
              className="form-input"
              {...register('email', { required: 'Email is required' })} 
            />
            {errors.email && <p className="form-error">{errors.email.message}</p>}
          </div>
          <div className="form-group">
            <label className="form-label">Phone</label>
            <input 
              className="form-input"
              {...register('phone')} 
            />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-input"
              {...register('password', {
                required: 'Password is required',
                minLength: { value: 6, message: 'Min 6 characters' },
              })}
            />
            {errors.password && <p className="form-error">{errors.password.message}</p>}
          </div>
          <div className="form-group">
            <label className="form-label">Confirm Password</label>
            <input
              type="password"
              className="form-input"
              {...register('confirmPassword', {
                required: 'Confirm your password',
                validate: (v) => v === watch('password') || 'Passwords do not match',
              })}
            />
            {errors.confirmPassword && <p className="form-error">{errors.confirmPassword.message}</p>}
          </div>

          {error && <p className="alert-error">{error}</p>}

          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? 'Creating...' : 'Register'}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Already have an account? <Link to="/login" className="auth-link">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
