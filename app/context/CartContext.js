import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { api } from '../lib/api';

const CartContext = createContext(null);

const emptyCart = {
  items: [],
  coupon: null,
  cartTotal: 0,
  finalTotal: 0
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(emptyCart);
  const [isLoading, setIsLoading] = useState(true);

  const syncCart = useCallback((data) => {
    setCart({
      items: data.items || [],
      coupon: data.coupon || null,
      cartTotal: Number(data.cartTotal || 0),
      finalTotal: Number(data.finalTotal || 0)
    });
  }, []);

  const refreshCart = useCallback(async () => {
    const { data } = await api.get('/api/cart');
    syncCart(data);
    return data;
  }, [syncCart]);

  const addToCart = useCallback(async (product) => {
    const { data } = await api.post('/api/cart/items', { productId: product.id });
    syncCart(data);
  }, [syncCart]);

  const changeQuantity = useCallback(async (productId, quantity) => {
    const { data } = await api.put(`/api/cart/items/${productId}`, { quantity: Math.max(quantity, 0) });
    syncCart(data);
  }, [syncCart]);

  const removeFromCart = useCallback(async (productId) => {
    const { data } = await api.delete(`/api/cart/items/${productId}`);
    syncCart(data);
  }, [syncCart]);

  const applyCouponCode = useCallback(async (code) => {
    const { data } = await api.post(`/api/cart/coupon/${encodeURIComponent(code)}`);
    syncCart(data);
  }, [syncCart]);

  const clearCoupon = useCallback(async () => {
    const { data } = await api.delete('/api/cart/coupon');
    syncCart(data);
  }, [syncCart]);

  useEffect(() => {
    api.post('/api/auth/session')
      .then(() => refreshCart())
      .finally(() => setIsLoading(false));
  }, [refreshCart]);

  const value = useMemo(() => ({
    isLoading,
    items: cart.items,
    coupon: cart.coupon,
    cartTotal: cart.cartTotal,
    finalTotal: cart.finalTotal,
    refreshCart,
    addToCart,
    changeQuantity,
    removeFromCart,
    applyCouponCode,
    clearCoupon
  }), [isLoading, cart, refreshCart, addToCart, changeQuantity, removeFromCart, applyCouponCode, clearCoupon]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used inside CartProvider');
  }
  return context;
};
