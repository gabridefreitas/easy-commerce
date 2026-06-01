import { Box, CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import { AppHeader } from "../components/AppHeader";
import { CartProvider } from "../context/CartContext";
import "../styles/globals.css";

const theme = createTheme();

export default function App({ Component, pageProps }) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <CartProvider>
        <AppHeader />
        <Box component="main">
          <Component {...pageProps} />
        </Box>
      </CartProvider>
    </ThemeProvider>
  );
}
