import { Alert, Box, Button, Container, IconButton, Stack, TextField, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import Link from 'next/link';
import { useState } from 'react';
import { useCart } from '../context/CartContext';

export default function CartPage() {
  const {
    items,
    isLoading,
    changeQuantity,
    removeFromCart,
    cartTotal,
    finalTotal,
    coupon,
    applyCouponCode,
    clearCoupon
  } = useCart();

  const [couponCode, setCouponCode] = useState('');
  const [feedback, setFeedback] = useState(null);

  const applyCoupon = async () => {
    if (!couponCode.trim()) {
      setFeedback({ type: 'error', message: 'Enter a coupon code' });
      return;
    }

    try {
      await applyCouponCode(couponCode.trim());
      setFeedback({ type: 'success', message: `Coupon ${couponCode.toUpperCase()} applied` });
    } catch (error) {
      setFeedback({ type: 'error', message: 'Invalid coupon' });
    }
  };

  const removeCoupon = async () => {
    await clearCoupon();
    setFeedback({ type: 'info', message: 'Coupon removed' });
  };

  return (
    <Container className="py-8 space-y-4">
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="h4">Your cart</Typography>
        <Link href="/"><Button>Continue shopping</Button></Link>
      </Stack>

      {isLoading ? (
        <Alert severity="info">Loading cart...</Alert>
      ) : items.length === 0 ? (
        <Alert severity="info">Your cart is empty.</Alert>
      ) : (
        <Stack spacing={2}>
          {items.map((item) => (
            <Box key={item.id} className="p-4 rounded border bg-white">
              <Stack direction="row" justifyContent="space-between" spacing={2} alignItems="center">
                <Box>
                  <Typography variant="h6">{item.title}</Typography>
                  <Typography>${Number(item.price).toFixed(2)} each</Typography>
                  <Typography>Subtotal: ${Number(item.subtotal).toFixed(2)}</Typography>
                </Box>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Button onClick={() => changeQuantity(item.id, item.quantity - 1)}>-</Button>
                  <Typography>{item.quantity}</Typography>
                  <Button onClick={() => changeQuantity(item.id, item.quantity + 1)}>+</Button>
                  <IconButton onClick={() => removeFromCart(item.id)} aria-label="remove item">
                    <DeleteIcon />
                  </IconButton>
                </Stack>
              </Stack>
            </Box>
          ))}
        </Stack>
      )}

      <Stack direction="row" spacing={2}>
        <TextField label="Coupon" value={couponCode} onChange={(event) => setCouponCode(event.target.value)} />
        <Button variant="outlined" onClick={applyCoupon}>Apply coupon</Button>
        {coupon && <Button color="inherit" onClick={removeCoupon}>Remove coupon</Button>}
      </Stack>

      {feedback && <Alert severity={feedback.type}>{feedback.message}</Alert>}
      {coupon && <Typography>Discount: {coupon.discountPercent}%</Typography>}
      <Typography variant="h6">Total: ${Number(cartTotal).toFixed(2)}</Typography>
      <Typography variant="h5">Final total: ${Number(finalTotal).toFixed(2)}</Typography>

      {items.length === 0 ? (
        <Button variant="contained" disabled>Checkout</Button>
      ) : (
        <Link href="/checkout">
          <Button variant="contained">Checkout</Button>
        </Link>
      )}
    </Container>
  );
}
