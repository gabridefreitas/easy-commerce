export const addItem = (items, product) => {
  const existing = items.find((item) => item.id === product.id);

  if (existing) {
    return items.map((item) =>
      item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
    );
  }

  return [...items, { ...product, quantity: 1 }];
};

export const updateQuantity = (items, productId, quantity) =>
  items.map((item) =>
    item.id === productId ? { ...item, quantity: Math.max(1, quantity) } : item
  );

export const removeItem = (items, productId) =>
  items.filter((item) => item.id !== productId);

export const subtotal = (item) => Number(item.price) * item.quantity;

export const total = (items) =>
  items.reduce((sum, item) => sum + subtotal(item), 0);

export const applyCoupon = (amount, discountPercent) => {
  if (!discountPercent || discountPercent <= 0) return amount;
  return Math.max(0, amount - (amount * discountPercent) / 100);
};
