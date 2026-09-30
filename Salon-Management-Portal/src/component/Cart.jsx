import { Link } from 'react-router-dom';
import '../css/Cart.css';
import { useDispatch, useSelector } from 'react-redux';
import { removeFromCart, updateQuantity } from '../store/cartSlice';
import { PageHeader, EmptyState, btnPrimary, btnSecondary, inputClass } from './common/ui';

const TAX_RATE = 0.08;

function Cart() {
  const dispatch = useDispatch();
  const { items, totalAmount } = useSelector((s) => s.cart);

  const subtotal = totalAmount;
  const tax = subtotal * TAX_RATE;
  const total = subtotal + tax;

  if (items.length === 0) {
    return (
      <div className="public-page-wrap" style={{ maxWidth: '48rem' }}>
        <PageHeader title="Cart" subtitle="0 items in your cart" />
        <EmptyState
          title="Your cart is empty"
          message="Looks like you haven't added anything to your cart yet."
          action={<Link to="/store" className={btnPrimary()}>Start Shopping</Link>}
        />
      </div>
    );
  }

  return (
    <div className="public-page-wrap" style={{ maxWidth: '48rem' }}>
      <PageHeader
        title="Cart"
        subtitle={`${items.length} item${items.length === 1 ? '' : 's'} in your cart`}
        action={<Link to="/store" className={btnSecondary()}>Continue Shopping</Link>}
      />

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
        {items.map((item) => (
          <div
            key={item.id}
            style={{
              backgroundColor: 'var(--color-white)',
              borderRadius: 'var(--radius-xl)',
              border: '1px solid var(--color-gray-200)',
              boxShadow: 'var(--shadow-sm)',
              padding: '1rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
            }}
            className="cart-item-row"
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1 }}>
              {item.image ? (
                <img
                  src={item.image}
                  alt={item.name}
                  style={{ height: '5rem', width: '5rem', borderRadius: 'var(--radius-lg)', objectFit: 'cover' }}
                />
              ) : (
                <div style={{ height: '5rem', width: '5rem', borderRadius: 'var(--radius-lg)', backgroundColor: 'var(--color-gray-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', color: 'var(--color-gray-400)' }}>
                  No image
                </div>
              )}
              <div style={{ flex: 1, minWidth: 0 }}>
                <h3 style={{ fontWeight: '600', color: 'var(--color-gray-800)', margin: 0 }}>{item.name}</h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--color-primary)', fontWeight: '500', marginTop: '0.25rem', margin: 0 }}>
                  ${Number(item.price).toFixed(2)}
                </p>
              </div>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <label style={{ fontSize: '0.875rem', color: 'var(--color-gray-500)' }}>Qty</label>
                <input
                  type="number"
                  min={1}
                  className={inputClass()}
                  style={{ width: '5rem' }}
                  value={item.quantity}
                  onChange={(e) =>
                    dispatch(
                      updateQuantity({
                        id: item.id,
                        quantity: Number(e.target.value) || 1,
                      })
                    )
                  }
                />
                <button
                  type="button"
                  style={{ fontSize: '0.875rem', color: 'var(--color-red-600)', fontWeight: '500', background: 'none', border: 'none', cursor: 'pointer' }}
                  onClick={() => dispatch(removeFromCart(item.id))}
                >
                  Remove
                </button>
              </div>
              <p style={{ fontWeight: '600', color: 'var(--color-gray-800)', margin: 0 }}>
                ${(item.price * item.quantity).toFixed(2)}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div style={{ backgroundColor: 'var(--color-white)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-gray-200)', boxShadow: 'var(--shadow-sm)', padding: '1.25rem', maxWidth: '24rem', marginLeft: 'auto', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', color: 'var(--color-gray-600)' }}>
          <span>Subtotal</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', color: 'var(--color-gray-600)' }}>
          <span>Tax (8%)</span>
          <span>${tax.toFixed(2)}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '700', fontSize: '1.125rem', color: 'var(--color-gray-800)', borderTop: '1px solid var(--color-gray-200)', paddingTop: '0.5rem', marginTop: '0.25rem' }}>
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>
        <Link to="/checkout" className={btnPrimary()} style={{ width: '100%', marginTop: '0.75rem', textAlign: 'center' }}>
          Proceed to Checkout
        </Link>
      </div>
    </div>
  );
}

export default Cart;
