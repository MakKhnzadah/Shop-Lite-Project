import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Product, CartItem } from '../../types';

interface CartState {
  items: CartItem[];
  totalItems: number;
  totalAmount: number;
}

const initialState: CartState = {
  items: [],
  totalItems: 0,
  totalAmount: 0,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<{ product: Product; quantity: number }>) => {
      const { product, quantity } = action.payload;
      const existingIndex = state.items.findIndex(
        (item) => item.product.id === product.id
      );

      if (existingIndex >= 0) {
        // Update quantity if item exists
        state.items[existingIndex].quantity += quantity;
      } else {
        // Add new item
        state.items.push({
          product,
          quantity,
        });
      }

      // Update totals
      state.totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0);
      state.totalAmount = state.items.reduce(
        (sum, item) => sum + item.quantity * item.product.price,
        0
      );
    },
    
    updateCartItem: (state, action: PayloadAction<{ productId: number; quantity: number }>) => {
      const { productId, quantity } = action.payload;
      const existingIndex = state.items.findIndex(
        (item) => item.product.id === productId
      );

      if (existingIndex >= 0) {
        if (quantity > 0) {
          // Update quantity
          state.items[existingIndex].quantity = quantity;
        } else {
          // Remove item if quantity is 0
          state.items.splice(existingIndex, 1);
        }
      }

      // Update totals
      state.totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0);
      state.totalAmount = state.items.reduce(
        (sum, item) => sum + item.quantity * item.product.price,
        0
      );
    },
    
    removeFromCart: (state, action: PayloadAction<number>) => {
      const productId = action.payload;
      state.items = state.items.filter((item) => item.product.id !== productId);

      // Update totals
      state.totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0);
      state.totalAmount = state.items.reduce(
        (sum, item) => sum + item.quantity * item.product.price,
        0
      );
    },
    
    clearCart: (state) => {
      state.items = [];
      state.totalItems = 0;
      state.totalAmount = 0;
    },
  },
});

export const { addToCart, updateCartItem, removeFromCart, clearCart } = cartSlice.actions;

export default cartSlice.reducer;