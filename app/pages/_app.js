import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { CartProvider } from '../context/CartContext';
import '../styles/globals.css';

const theme = createTheme();

export default function App({ Component, pageProps }) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <CartProvider>
        <Component {...pageProps} />
      </CartProvider>
    </ThemeProvider>
  );
}
