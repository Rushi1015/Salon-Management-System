import { useState } from 'react';
import '../css/ForgotPassword.css';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { forgotPasswordService, resetPasswordService } from '../services/authService';

function ForgotPassword() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [step, setStep] = useState(1);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [loading, setLoading] = useState(false);

  const onRequest = async (data) => {
    setError('');
    setLoading(true);
    try {
      const res = await forgotPasswordService({ email: data.email });
      setMessage(res.message || 'Reset instructions sent.');
      if (res.resetToken) setResetToken(res.resetToken);
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || 'Request failed.');
    } finally {
      setLoading(false);
    }
  };

  const onReset = async (data) => {
    setError('');
    setLoading(true);
    try {
      await resetPasswordService({
        resetToken: data.token || resetToken,
        newPassword: data.password,
      });
      setMessage('Password reset successful. You can now login.');
      setStep(3);
    } catch (err) {
      setError(err.response?.data?.message || 'Reset failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-layout">
      <div className="auth-card">
        <h2 className="auth-title">Reset Password</h2>
        <p className="auth-subtitle">Recover access to your account</p>

        {step === 1 && (
          <form onSubmit={handleSubmit(onRequest)} className="auth-form">
            <div className="form-group">
              <label className="form-label">Email</label>
              <input 
                type="email" 
                className="form-input"
                {...register('email', { required: 'Email is required' })} 
              />
              {errors.email && <p className="form-error">{errors.email.message}</p>}
            </div>
            {error && <p className="alert-error">{error}</p>}
            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleSubmit(onReset)} className="auth-form">
            {message && <p className="alert-success">{message}</p>}
            <div className="form-group">
              <label className="form-label">Reset Token</label>
              <input 
                defaultValue={resetToken} 
                className="form-input"
                {...register('token', { required: 'Token is required' })} 
              />
            </div>
            <div className="form-group">
              <label className="form-label">New Password</label>
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
            {error && <p className="alert-error">{error}</p>}
            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>
        )}

        {step === 3 && (
          <div className="auth-form" style={{ textAlign: 'center' }}>
            <p className="alert-success">{message}</p>
            <Link to="/login" className="btn-primary" style={{ display: 'block', textDecoration: 'none', boxSizing: 'border-box' }}>
              Go to Login
            </Link>
          </div>
        )}

        <div className="auth-footer">
          <p>
            <Link to="/login" className="back-link">← Back to login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
