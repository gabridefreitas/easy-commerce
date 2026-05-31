import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { addItem, applyCoupon, removeItem, total, updateQuantity } from '../utils/cart';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState([]);
  const [coupon, setCoupon] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem('easycommerce-cart');
    if (stored) {
      const parsed = JSON.parse(stored);
      setItems(parsed.items || []);
      setCoupon(parsed.coupon || null);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('easycommerce-cart', JSON.stringify({ items, coupon }));
  }, [items, coupon]);

  const value = useMemo(() => {
    const cartTotal = total(items);
    const discountPercent = coupon?.discountPercent || 0;

    return {
      items,
      coupon,
      addToCart: (product) => setItems((prev) => addItem(prev, product)),
      changeQuantity: (productId, quantity) => setItems((prev) => updateQuantity(prev, productId, quantity)),
      removeFromCart: (productId) => setItems((prev) => removeItem(prev, productId)),
      setCoupon,
      clearCart: () => {
        setItems([]);
        setCoupon(null);
      },
      cartTotal,
      finalTotal: applyCoupon(cartTotal, discountPercent)
    };
  }, [items, coupon]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used inside CartProvider');
  }
  return context;
};
