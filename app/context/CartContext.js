import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { api } from '../lib/api';
import { getOrCreateClientId } from '../utils/clientId';

const CartContext = createContext(null);

const emptyCart = {
  items: [],
  coupon: null,
  cartTotal: 0,
  finalTotal: 0
};

export const CartProvider = ({ children }) => {
  const [clientId, setClientId] = useState(null);
  const [cart, setCart] = useState(emptyCart);
  const [isLoading, setIsLoading] = useState(true);

  const syncCart = (data) => {
    setCart({
      items: data.items || [],
      coupon: data.coupon || null,
      cartTotal: Number(data.cartTotal || 0),
      finalTotal: Number(data.finalTotal || 0)
    });
  };

  const refreshCart = async (id) => {
    const { data } = await api.get(`/api/cart/${id}`);
    syncCart(data);
    return data;
  };

  useEffect(() => {
    const id = getOrCreateClientId();
    setClientId(id);

    if (!id) {
      setIsLoading(false);
      return;
    }

    refreshCart(id)
      .finally(() => setIsLoading(false));
  }, []);

  const value = useMemo(() => ({
    clientId,
    isLoading,
    items: cart.items,
    coupon: cart.coupon,
    cartTotal: cart.cartTotal,
    finalTotal: cart.finalTotal,
    refreshCart: () => (clientId ? refreshCart(clientId) : Promise.resolve(emptyCart)),
    addToCart: async (product) => {
      if (!clientId) return;
      const { data } = await api.post(`/api/cart/${clientId}/items`, { productId: product.id });
      syncCart(data);
    },
    changeQuantity: async (productId, quantity) => {
      if (!clientId) return;
      const { data } = await api.put(`/api/cart/${clientId}/items/${productId}`, { quantity: Math.max(quantity, 0) });
      syncCart(data);
    },
    removeFromCart: async (productId) => {
      if (!clientId) return;
      const { data } = await api.delete(`/api/cart/${clientId}/items/${productId}`);
      syncCart(data);
    },
    applyCouponCode: async (code) => {
      if (!clientId) return;
      const { data } = await api.post(`/api/cart/${clientId}/coupon/${encodeURIComponent(code)}`);
      syncCart(data);
    },
    clearCoupon: async () => {
      if (!clientId) return;
      const { data } = await api.delete(`/api/cart/${clientId}/coupon`);
      syncCart(data);
    }
  }), [clientId, isLoading, cart]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used inside CartProvider');
  }
  return context;
};
