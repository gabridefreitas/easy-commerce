import { Button, Card, CardActions, CardContent, CardMedia, Typography } from '@mui/material';

export const ProductCard = ({ product, onAdd }) => (
  <Card className="h-full flex flex-col">
    <CardMedia component="img" height="180" image={product.image} alt={product.title} />
    <CardContent className="flex-1">
      <Typography variant="h6">{product.title}</Typography>
      <Typography variant="body2" color="text.secondary">{product.description}</Typography>
      <Typography variant="h6" className="mt-2">${Number(product.price).toFixed(2)}</Typography>
    </CardContent>
    <CardActions>
      <Button fullWidth variant="contained" onClick={() => onAdd(product)}>
        Add to cart
      </Button>
    </CardActions>
  </Card>
);
