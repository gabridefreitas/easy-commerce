import { Box, Divider, List, ListItem, ListItemText, Stack, Typography } from '@mui/material';

export function OrderSummary({ order }) {
  return (
    <Stack spacing={2}>
      <Typography variant="h5">Resumo do pedido #{order.id}</Typography>

      <Box>
        <Typography variant="h6">Dados do usuário</Typography>
        <Typography>Nome: {order.name}</Typography>
        <Typography>Email: {order.email}</Typography>
        <Typography>CPF: {order.cpf}</Typography>
        <Typography>Data de nascimento: {order.birthDate}</Typography>
      </Box>

      <Divider />

      <Box>
        <Typography variant="h6">Endereço</Typography>
        <Typography>{order.street}, {order.number}</Typography>
        <Typography>{order.city} - {order.state}</Typography>
        <Typography>CEP: {order.zipCode}</Typography>
      </Box>

      <Divider />

      <Box>
        <Typography variant="h6">Pagamento</Typography>
        <Typography>Método: {order.paymentMethod}</Typography>
        <Typography>Total pago: ${Number(order.total).toFixed(2)}</Typography>
      </Box>

      <Divider />

      <Box>
        <Typography variant="h6">Itens</Typography>
        <List>
          {order.items.map((item) => (
            <ListItem key={`${item.productId}-${item.title}`} disablePadding>
              <ListItemText
                primary={`${item.title} x${item.quantity}`}
                secondary={`$${Number(item.unitPrice).toFixed(2)} cada - Subtotal: $${Number(item.subtotal).toFixed(2)}`}
              />
            </ListItem>
          ))}
        </List>
      </Box>
    </Stack>
  );
}
