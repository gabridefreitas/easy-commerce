import {
  Alert,
  Box,
  Button,
  Container,
  FormControlLabel,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { OrderSummary } from "../components/OrderSummary";
import { useCart } from "../context/CartContext";
import { api } from "../lib/api";
import { formatCurrencyBRL } from "../utils/format";

const emptyForm = {
  name: "",
  email: "",
  cpf: "",
  birthDate: "",
  street: "",
  number: "",
  city: "",
  state: "",
  zipCode: "",
};

const labels = {
  name: "Nome",
  email: "E-mail",
  cpf: "CPF",
  birthDate: "Data de nascimento",
  street: "Rua",
  number: "Número",
  city: "Cidade",
  state: "Estado",
  zipCode: "CEP",
};

export default function CheckoutPage() {
  const { items, finalTotal, isLoading, refreshCart } = useCart();
  const [form, setForm] = useState(emptyForm);
  const [paymentMethod, setPaymentMethod] = useState("pix");
  const [errors, setErrors] = useState({});
  const [completed, setCompleted] = useState(false);
  const [orderSummary, setOrderSummary] = useState(null);
  const [apiError, setApiError] = useState("");

  const isCartEmpty = items.length === 0;

  const validate = () => {
    const nextErrors = {};
    Object.entries(form).forEach(([key, value]) => {
      if (!value) {
        nextErrors[key] = "Campo obrigatório";
      }
    });

    if (form.email && !/\S+@\S+\.\S+/.test(form.email)) {
      nextErrors.email = "E-mail inválido";
    }

    if (form.cpf && form.cpf.replace(/\D/g, "").length !== 11) {
      nextErrors.cpf = "CPF deve ter 11 dígitos";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleFinish = async () => {
    setApiError("");

    if (!validate() || isCartEmpty) {
      return;
    }

    try {
      const { data } = await api.post("/api/orders", {
        ...form,
        paymentMethod,
      });

      setOrderSummary(data);
      setCompleted(true);
      refreshCart();
    } catch {
      setApiError(
        "Não foi possível finalizar a compra. Verifique os dados e tente novamente."
      );
    }
  };

  if (completed && orderSummary) {
    return (
      <Container className="py-8 space-y-4">
        <Alert severity="success">
          Pagamento confirmado! Pedido realizado com sucesso.
        </Alert>
        <OrderSummary order={orderSummary} />
      </Container>
    );
  }

  return (
    <Container className="py-8 space-y-4">
      <Typography variant="h4">Finalização da compra</Typography>
      {isLoading && <Alert severity="info">Carregando carrinho...</Alert>}
      {isCartEmpty && !isLoading && (
        <Alert severity="warning">
          Você não pode finalizar a compra com o carrinho vazio.
        </Alert>
      )}
      {apiError && <Alert severity="error">{apiError}</Alert>}

      <Stack spacing={2}>
        {Object.keys(emptyForm).map((field) => (
          <TextField
            key={field}
            label={labels[field]}
            type={field === "birthDate" ? "date" : "text"}
            InputLabelProps={
              field === "birthDate" ? { shrink: true } : undefined
            }
            value={form[field]}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, [field]: event.target.value }))
            }
            error={Boolean(errors[field])}
            helperText={errors[field]}
          />
        ))}
      </Stack>

      <Box>
        <Typography variant="h6">Pagamento</Typography>
        <RadioGroup
          value={paymentMethod}
          onChange={(event) => setPaymentMethod(event.target.value)}
        >
          <FormControlLabel value="pix" control={<Radio />} label="Pix" />
        </RadioGroup>
        <Alert severity="info">Chave Pix: easycommerce@pix.test</Alert>
      </Box>

      <Typography variant="h5">
        Total: {formatCurrencyBRL(finalTotal)}
      </Typography>
      <Button
        variant="contained"
        onClick={handleFinish}
        disabled={isCartEmpty || isLoading}
      >
        Finalizar compra
      </Button>
    </Container>
  );
}
