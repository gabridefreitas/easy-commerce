import { Alert, Container } from "@mui/material";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { OrderSummary } from "../../components/OrderSummary";
import { api } from "../../lib/api";

export default function OrderTrackingPage() {
  const router = useRouter();
  const { id } = router.query;

  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!router.isReady || !id) {
      return;
    }

    let active = true;

    const loadOrder = async () => {
      setLoading(true);
      setError("");
      try {
        const { data } = await api.get(`/api/orders/${id}`);
        if (active) {
          setOrder(data);
        }
      } catch {
        if (active) {
          setOrder(null);
          setError("Pedido não encontrado.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadOrder();

    return () => {
      active = false;
    };
  }, [id, router.isReady]);

  return (
    <Container className="py-8 space-y-4">
      {loading && <Alert severity="info">Buscando pedido...</Alert>}
      {!loading && error && <Alert severity="error">{error}</Alert>}
      {!loading && order && <OrderSummary order={order} />}
    </Container>
  );
}
