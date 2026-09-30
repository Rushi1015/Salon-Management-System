import { createSlice } from '@reduxjs/toolkit';

const loadCart = () => {
  try {
    return JSON.parse(localStorage.getItem('cart') || 'null');
  } catch {
    return null;
  }
};

const saved = loadCart();

const initialState = saved || {
  items: [],
  totalQuantity: 0,
  totalAmount: 0,
};

const recalc = (state) => {
  state.totalQuantity = state.items.reduce((sum, i) => sum + i.quantity, 0);
  state.totalAmount = state.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  localStorage.setItem('cart', JSON.stringify({
    items: state.items,
    totalQuantity: state.totalQuantity,
    totalAmount: state.totalAmount,
  }));
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const product = action.payload;
      const existing = state.items.find((i) => i.id === product.id);
      if (existing) {
        existing.quantity += 1;
      } else {
        state.items.push({
          id: product.id,
          name: product.name,
          price: product.price,
          quantity: 1,
          image: product.image || '',
        });
      }
      recalc(state);
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter((i) => i.id !== action.payload);
      recalc(state);
    },
    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const item = state.items.find((i) => i.id === id);
      if (item) {
        item.quantity = Math.max(1, quantity);
      }
      recalc(state);
    },
    clearCart: (state) => {
      state.items = [];
      state.totalQuantity = 0;
      state.totalAmount = 0;
      localStorage.removeItem('cart');
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
