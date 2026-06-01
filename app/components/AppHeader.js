import {
  Alert,
  AppBar,
  Box,
  Button,
  Collapse,
  Container,
  Stack,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import ManageSearchIcon from "@mui/icons-material/ManageSearch";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { useCart } from "../context/CartContext";
import { api } from "../lib/api";

export function AppHeader() {
  const router = useRouter();
  const { items } = useCart();
  const [openTracking, setOpenTracking] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [error, setError] = useState("");

  const handleTrackOrder = async () => {
    const normalized = Number(orderId);

    if (!Number.isInteger(normalized) || normalized <= 0) {
      setError("Informe um id de pedido válido.");
      return;
    }

    try {
      await api.get(`/api/orders/${normalized}`);
      setError("");
      setOrderId("");
      setOpenTracking(false);
      router.push(`/orders/${normalized}`);
    } catch {
      setError("Pedido não encontrado.");
    }
  };

  return (
    <AppBar position="static" color="inherit" elevation={1}>
      <Container>
        <Toolbar
          disableGutters
          sx={{
            justifyContent: "space-between",
            gap: 2,
            flexWrap: "wrap",
            py: 1,
          }}
        >
          <Link href="/" style={{ textDecoration: "none", color: "inherit" }}>
            <Typography variant="h6">EasyCommerce</Typography>
          </Link>

          <Stack direction="row" spacing={1}>
            <Button
              startIcon={<ManageSearchIcon />}
              variant="outlined"
              onClick={() => {
                setError("");
                setOpenTracking((prev) => !prev);
              }}
            >
              Acompanhar meu pedido
            </Button>
            <Link href="/cart">
              <Button startIcon={<ShoppingCartIcon />} variant="outlined">
                Carrinho ({items.length})
              </Button>
            </Link>
          </Stack>
        </Toolbar>

        <Collapse in={openTracking}>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={1} pb={2}>
            <TextField
              size="small"
              label="ID do pedido"
              value={orderId}
              onChange={(event) => setOrderId(event.target.value)}
            />
            <Button variant="contained" onClick={handleTrackOrder}>
              Buscar
            </Button>
          </Stack>
          {error && (
            <Box pb={2}>
              <Alert severity="error">{error}</Alert>
            </Box>
          )}
        </Collapse>
      </Container>
    </AppBar>
  );
}
