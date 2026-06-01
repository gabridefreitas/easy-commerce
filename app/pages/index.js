import { Alert, Container, Pagination, Snackbar, Stack } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { useRouter } from "next/router";
import { useState } from "react";
import { ProductCard } from "../components/ProductCard";
import { useCart } from "../context/CartContext";
import { api } from "../lib/api";

export default function Home({ items, currentPage, totalPages }) {
  const router = useRouter();
  const { addToCart } = useCart();
  const [open, setOpen] = useState(false);

  const handlePageChange = (_, value) => {
    router.push(`/?page=${value - 1}`);
  };

  const handleAdd = async (product) => {
    await addToCart(product);
    setOpen(true);
  };

  return (
    <Container className="py-8 space-y-6">
      <Grid container spacing={2}>
        {items.map((product) => (
          <Grid key={product.id} size={{ xs: 12, sm: 6, md: 3 }}>
            <ProductCard product={product} onAdd={handleAdd} />
          </Grid>
        ))}
      </Grid>

      <Stack alignItems="center">
        <Pagination
          page={currentPage + 1}
          count={Math.max(totalPages, 1)}
          onChange={handlePageChange}
          color="primary"
        />
      </Stack>

      <Snackbar
        open={open}
        autoHideDuration={2000}
        onClose={() => setOpen(false)}
      >
        <Alert severity="success" variant="filled">
          Produto adicionado ao carrinho!
        </Alert>
      </Snackbar>
    </Container>
  );
}

export async function getServerSideProps(context) {
  const page = Number(context.query.page || 0);
  const response = await api.get("/api/products", {
    params: { page, size: 8 },
  });

  return {
    props: {
      items: response.data.items,
      currentPage: response.data.currentPage,
      totalPages: response.data.totalPages,
    },
  };
}
