import { useEffect, useState } from 'react';
import '../css/Checkout.css';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { createOrder } from '../services/orderService';
import { clearCart } from '../store/cartSlice';
import { PageHeader, EmptyState, inputClass, btnPrimary, btnSecondary } from './common/ui';

const TAX_RATE = 0.08;

function Checkout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useSelector((s) => s.auth);
  const { items, totalAmount } = useSelector((s) => s.cart);

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      street: '',
      city: '',
      state: '',
      zip: '',
      country: '',
      paymentMethod: 'Cash',
    },
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: location } });
    }
  }, [isAuthenticated, navigate, location]);

  const subtotal = totalAmount;
  const tax = subtotal * TAX_RATE;
  const total = subtotal + tax;

  if (!isAuthenticated) return null;

  if (items.length === 0) {
    return (
      <div className="checkout-wrap">
        <PageHeader title="Checkout" />
        <EmptyState message="Your cart is empty" />
        <div className="checkout-empty">
          <Link to="/store" className={btnPrimary()}>Browse Store</Link>
        </div>
      </div>
    );
  }

  const onSubmit = async (data) => {
    setError('');
    setSubmitting(true);
    try {
      await createOrder({
        items: items.map((item) => ({
          product: item.id,
          quantity: item.quantity,
        })),
        shippingAddress: {
          street: data.street,
          city: data.city,
          state: data.state,
          zip: data.zip,
          country: data.country,
        },
        paymentMethod: data.paymentMethod,
      });
      dispatch(clearCart());
      navigate('/orders');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to place order. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="checkout-wrap">
      <PageHeader
        title="Checkout"
        subtitle="Confirm shipping and payment"
        action={<Link to="/cart" className={btnSecondary()}>Back to Cart</Link>}
      />

      <div className="checkout-layout">
        <form onSubmit={handleSubmit(onSubmit)} className="checkout-card checkout-form">
          <h2 className="checkout-card-title">Shipping Address</h2>

          <div className="checkout-field">
            <label className="checkout-label">Street</label>
            <input
              className={inputClass()}
              placeholder="123 Main St"
              {...register('street', { required: 'Street is required' })}
            />
            {errors.street && <p className="checkout-error">{errors.street.message}</p>}
          </div>

          <div className="checkout-grid-2">
            <div className="checkout-field">
              <label className="checkout-label">City</label>
              <input
                className={inputClass()}
                {...register('city', { required: 'City is required' })}
              />
              {errors.city && <p className="checkout-error">{errors.city.message}</p>}
            </div>
            <div className="checkout-field">
              <label className="checkout-label">State</label>
              <input
                className={inputClass()}
                {...register('state', { required: 'State is required' })}
              />
              {errors.state && <p className="checkout-error">{errors.state.message}</p>}
            </div>
          </div>

          <div className="checkout-grid-2">
            <div className="checkout-field">
              <label className="checkout-label">ZIP</label>
              <input
                className={inputClass()}
                {...register('zip', { required: 'ZIP is required' })}
              />
              {errors.zip && <p className="checkout-error">{errors.zip.message}</p>}
            </div>
            <div className="checkout-field">
              <label className="checkout-label">Country</label>
              <input
                className={inputClass()}
                {...register('country', { required: 'Country is required' })}
              />
              {errors.country && <p className="checkout-error">{errors.country.message}</p>}
            </div>
          </div>

          <div className="checkout-field">
            <label className="checkout-label">Payment Method</label>
            <select
              className={inputClass()}
              {...register('paymentMethod', { required: 'Payment method is required' })}
            >
              <option value="Cash">Cash</option>
              <option value="Card">Card</option>
              <option value="UPI">UPI</option>
            </select>
            {errors.paymentMethod && (
              <p className="checkout-error">{errors.paymentMethod.message}</p>
            )}
          </div>

          {error && <p className="checkout-error" style={{ fontSize: '0.875rem' }}>{error}</p>}

          <button type="submit" disabled={submitting} className={btnPrimary()} style={{ width: '100%', marginTop: '0.5rem' }}>
            {submitting ? 'Placing Order...' : 'Place Order'}
          </button>
        </form>

        <div>
          <div className="checkout-card checkout-summary">
            <h2 className="checkout-card-title">Order Summary</h2>
            <ul className="checkout-item-list">
              {items.map((item) => (
                <li key={item.id} className="checkout-item">
                  <span className="checkout-item-name">
                    {item.name} × {item.quantity}
                  </span>
                  <span className="checkout-item-price">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </li>
              ))}
            </ul>
            <div className="checkout-totals">
              <div className="checkout-total-row">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="checkout-total-row">
                <span>Tax (8%)</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="checkout-total-final">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
