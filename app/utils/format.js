export const formatCurrencyBRL = (amount) =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(Number(amount ?? 0));
