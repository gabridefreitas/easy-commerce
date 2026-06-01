import {
  Alert,
  Box,
  Button,
  Container,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import Link from "next/link";
import { useState } from "react";
import { useCart } from "../context/CartContext";
import { formatCurrencyBRL } from "../utils/format";

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
    clearCoupon,
  } = useCart();

  const [couponCode, setCouponCode] = useState("");
  const [feedback, setFeedback] = useState(null);

  const applyCoupon = async () => {
    if (!couponCode.trim()) {
      setFeedback({ type: "error", message: "Digite um cupom" });
      return;
    }

    try {
      await applyCouponCode(couponCode.trim());
      setFeedback({
        type: "success",
        message: `Cupom ${couponCode.toUpperCase()} aplicado`,
      });
    } catch {
      setFeedback({ type: "error", message: "Cupom inválido" });
    }
  };

  const removeCoupon = async () => {
    await clearCoupon();
    setFeedback({ type: "info", message: "Cupom removido" });
  };

  return (
    <Container className="py-8 space-y-4">
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="h4">Seu carrinho</Typography>
        <Link href="/">
          <Button>Continuar Comprando</Button>
        </Link>
      </Stack>

      {isLoading ? (
        <Alert severity="info">Carregando carrinho...</Alert>
      ) : items.length === 0 ? (
        <Alert severity="info">Seu carrinho está vazio.</Alert>
      ) : (
        <Stack spacing={2}>
          {items.map((item) => (
            <Box key={item.id} className="p-4 rounded border bg-white">
              <Stack
                direction="row"
                justifyContent="space-between"
                spacing={2}
                alignItems="center"
              >
                <Box>
                  <Typography variant="h6">{item.title}</Typography>
                  <Typography>{formatCurrencyBRL(item.price)} cada</Typography>
                  <Typography>
                    Subtotal: {formatCurrencyBRL(item.subtotal)}
                  </Typography>
                </Box>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Button
                    onClick={() => changeQuantity(item.id, item.quantity - 1)}
                  >
                    -
                  </Button>
                  <Typography>{item.quantity}</Typography>
                  <Button
                    onClick={() => changeQuantity(item.id, item.quantity + 1)}
                  >
                    +
                  </Button>
                  <IconButton
                    onClick={() => removeFromCart(item.id)}
                    aria-label="Remover item"
                  >
                    <DeleteIcon />
                  </IconButton>
                </Stack>
              </Stack>
            </Box>
          ))}
        </Stack>
      )}

      <Stack direction="row" spacing={2}>
        <TextField
          label="Cupom"
          value={couponCode}
          onChange={(event) => setCouponCode(event.target.value)}
        />
        <Button variant="outlined" onClick={applyCoupon}>
          Aplicar cupom
        </Button>
        {coupon && (
          <Button color="inherit" onClick={removeCoupon}>
            Remover cupom
          </Button>
        )}
      </Stack>

      {feedback && <Alert severity={feedback.type}>{feedback.message}</Alert>}
      {coupon && <Typography>Desconto: {coupon.discountPercent}%</Typography>}
      <Typography variant="h6">
        Total: {formatCurrencyBRL(cartTotal)}
      </Typography>
      <Typography variant="h5">
        Total final: {formatCurrencyBRL(finalTotal)}
      </Typography>

      {items.length === 0 ? (
        <Button variant="contained" disabled>
          Finalizar compra
        </Button>
      ) : (
        <Link href="/checkout">
          <Button variant="contained">Finalizar compra</Button>
        </Link>
      )}
    </Container>
  );
}
