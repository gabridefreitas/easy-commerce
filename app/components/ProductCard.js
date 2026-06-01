import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Typography,
} from "@mui/material";
import { formatCurrencyBRL } from "../utils/format";

export function ProductCard({ product, onAdd }) {
  const { description, image, title, price } = product ?? {};

  return (
    <Card className="h-full flex flex-col">
      <CardMedia component="img" height="180" image={image} alt={title} />
      <CardContent className="flex-1">
        <Typography variant="h6">{title}</Typography>
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
        <Typography variant="h6" className="mt-2">
          {formatCurrencyBRL(price)}
        </Typography>
      </CardContent>
      <CardActions>
        <Button fullWidth variant="contained" onClick={() => onAdd(product)}>
          Comprar
        </Button>
      </CardActions>
    </Card>
  );
}
