import { addItem, applyCoupon, removeItem, total, updateQuantity } from '../utils/cart';

describe('cart utils', () => {
  const product = { id: 1, title: 'Basic T-Shirt', price: 50 };

  it('adds new item with quantity 1', () => {
    const result = addItem([], product);
    expect(result).toEqual([{ ...product, quantity: 1 }]);
  });

  it('increases quantity when adding existing item', () => {
    const result = addItem([{ ...product, quantity: 1 }], product);
    expect(result[0].quantity).toBe(2);
  });

  it('never allows quantity lower than 1', () => {
    const result = updateQuantity([{ ...product, quantity: 2 }], 1, 0);
    expect(result[0].quantity).toBe(1);
  });

  it('removes an item from cart', () => {
    const result = removeItem([{ ...product, quantity: 2 }], 1);
    expect(result).toEqual([]);
  });

  it('applies percentage coupon', () => {
    expect(applyCoupon(100, 10)).toBe(90);
  });

  it('calculates cart total', () => {
    const amount = total([{ ...product, quantity: 2 }]);
    expect(amount).toBe(100);
  });
});
