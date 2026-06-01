import {
  Box,
  Divider,
  List,
  ListItem,
  ListItemText,
  Stack,
  Typography,
} from "@mui/material";
import { formatCurrencyBRL } from "../utils/format";

export function OrderSummary({ order }) {
  const {
    birthDate,
    city,
    cpf,
    email,
    id,
    items,
    name,
    number,
    paymentMethod,
    state,
    street,
    total,
    zipCode,
  } = order ?? {};

  return (
    <Stack spacing={2}>
      <Typography variant="h5">Resumo do pedido #{id}</Typography>

      <Box>
        <Typography variant="h6">Dados do usuário</Typography>
        <Typography>Nome: {name}</Typography>
        <Typography>Email: {email}</Typography>
        <Typography>CPF: {cpf}</Typography>
        <Typography>Data de nascimento: {birthDate}</Typography>
      </Box>

      <Divider />

      <Box>
        <Typography variant="h6">Endereço</Typography>
        <Typography>
          {street}, {number}
        </Typography>
        <Typography>
          {city} - {state}
        </Typography>
        <Typography>CEP: {zipCode}</Typography>
      </Box>

      <Divider />

      <Box>
        <Typography variant="h6">Pagamento</Typography>
        <Typography>Método: {paymentMethod}</Typography>
        <Typography>Total pago: {formatCurrencyBRL(total)}</Typography>
      </Box>

      <Divider />

      <Box>
        <Typography variant="h6">Itens</Typography>
        <List>
          {items.map((item) => (
            <ListItem key={`${item.productId}-${item.title}`} disablePadding>
              <ListItemText
                primary={`${item.title} x${item.quantity}`}
                secondary={`${formatCurrencyBRL(
                  item.unitPrice
                )} cada - Subtotal: ${formatCurrencyBRL(item.subtotal)}`}
              />
            </ListItem>
          ))}
        </List>
      </Box>
    </Stack>
  );
}
