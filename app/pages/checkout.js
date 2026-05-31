import { Alert, Box, Button, Container, FormControlLabel, Radio, RadioGroup, Stack, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import { OrderSummary } from '../components/OrderSummary';
import { useCart } from '../context/CartContext';
import { api } from '../lib/api';

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

const labels = {
  name: 'Name',
  email: 'Email',
  cpf: 'CPF',
  birthDate: 'Birth date',
  street: 'Street',
  number: 'Number',
  city: 'City',
  state: 'State',
  zipCode: 'ZIP Code'
};

export default function CheckoutPage() {
  const { clientId, items, finalTotal, isLoading } = useCart();
  const [form, setForm] = useState(emptyForm);
  const [paymentMethod, setPaymentMethod] = useState('pix');
  const [errors, setErrors] = useState({});
  const [completed, setCompleted] = useState(false);
  const [orderSummary, setOrderSummary] = useState(null);
  const [apiError, setApiError] = useState('');

  const isCartEmpty = items.length === 0;

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

  const handleFinish = async () => {
    setApiError('');

    if (!validate() || isCartEmpty || !clientId) {
      return;
    }

    try {
      const { data } = await api.post('/api/orders', {
        clientId,
        ...form,
        paymentMethod
      });

      setOrderSummary(data);
      setCompleted(true);
    } catch (error) {
      setApiError('Could not finish purchase. Please verify the data and try again.');
    }
  };

  if (completed && orderSummary) {
    return (
      <Container className="py-8 space-y-4">
        <Alert severity="success">Payment confirmed! Order placed successfully.</Alert>
        <OrderSummary order={orderSummary} />
      </Container>
    );
  }

  return (
    <Container className="py-8 space-y-4">
      <Typography variant="h4">Checkout</Typography>
      {isLoading && <Alert severity="info">Loading cart...</Alert>}
      {isCartEmpty && !isLoading && <Alert severity="warning">You cannot checkout with an empty cart.</Alert>}
      {apiError && <Alert severity="error">{apiError}</Alert>}

      <Stack spacing={2}>
        {Object.keys(emptyForm).map((field) => (
          <TextField
            key={field}
            label={labels[field]}
            type={field === 'birthDate' ? 'date' : 'text'}
            InputLabelProps={field === 'birthDate' ? { shrink: true } : undefined}
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

      <Typography variant="h5">Total: ${Number(finalTotal).toFixed(2)}</Typography>
      <Button variant="contained" onClick={handleFinish} disabled={isCartEmpty || isLoading}>Finish purchase</Button>
    </Container>
  );
}
