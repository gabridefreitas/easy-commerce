import { Alert, Box, Button, Container, FormControlLabel, Radio, RadioGroup, Stack, TextField, Typography } from '@mui/material';
import { useMemo, useState } from 'react';
import { useCart } from '../context/CartContext';

const emptyForm = {
  name: '',
  email: '',
  cpf: '',
  birthDate: '',
  street: '',
  number: '',
  city: '',
  state: '',
  zipCode: ''
};

export default function CheckoutPage() {
  const { items, finalTotal, clearCart } = useCart();
  const [form, setForm] = useState(emptyForm);
  const [paymentMethod, setPaymentMethod] = useState('pix');
  const [errors, setErrors] = useState({});
  const [completed, setCompleted] = useState(false);
  const [summary, setSummary] = useState({ items: '', total: 0 });

  const isCartEmpty = items.length === 0;

  const orderItems = useMemo(() => items.map((item) => `${item.title} x${item.quantity}`).join(', '), [items]);

  const validate = () => {
    const nextErrors = {};
    Object.entries(form).forEach(([key, value]) => {
      if (!value) {
        nextErrors[key] = 'Required field';
      }
    });

    if (form.email && !/\S+@\S+\.\S+/.test(form.email)) {
      nextErrors.email = 'Invalid email';
    }

    if (form.cpf && form.cpf.replace(/\D/g, '').length !== 11) {
      nextErrors.cpf = 'CPF must have 11 digits';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleFinish = () => {
    if (!validate() || isCartEmpty || paymentMethod !== 'pix') {
      return;
    }

    setSummary({ items: orderItems, total: finalTotal });
    setCompleted(true);
    clearCart();
  };

  if (completed) {
    return (
      <Container className="py-8 space-y-4">
        <Alert severity="success">Payment confirmed! Order placed successfully.</Alert>
      <Typography>Items: {summary.items}</Typography>
      <Typography>Total paid: ${summary.total.toFixed(2)}</Typography>
      </Container>
    );
  }

  return (
    <Container className="py-8 space-y-4">
      <Typography variant="h4">Checkout</Typography>
      {isCartEmpty && <Alert severity="warning">You cannot checkout with an empty cart.</Alert>}

      <Stack spacing={2}>
        {Object.keys(emptyForm).map((field) => (
          <TextField
            key={field}
            label={field}
            value={form[field]}
            onChange={(event) => setForm((prev) => ({ ...prev, [field]: event.target.value }))}
            error={Boolean(errors[field])}
            helperText={errors[field]}
          />
        ))}
      </Stack>

      <Box>
        <Typography variant="h6">Payment</Typography>
        <RadioGroup value={paymentMethod} onChange={(event) => setPaymentMethod(event.target.value)}>
          <FormControlLabel value="pix" control={<Radio />} label="Pix" />
        </RadioGroup>
        <Alert severity="info">Pix key: easycommerce@pix.test</Alert>
      </Box>

      <Typography variant="h5">Total: ${finalTotal.toFixed(2)}</Typography>
      <Button variant="contained" onClick={handleFinish} disabled={isCartEmpty}>Finish purchase</Button>
    </Container>
  );
}
