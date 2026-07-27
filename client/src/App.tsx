import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch, useLocation } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import { CartDrawerProvider } from "./contexts/CartDrawerContext";
import { useEffect, useState } from "react";
import { initFacebookPixel, trackPageView } from "./lib/facebookPixel";
import Home from "./pages/Home";
import Catalog from "./pages/Catalog";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Wishlist from "./pages/Wishlist";
import Contact from "./pages/Contact";
import About from "./pages/About";
import Admin from "./pages/Admin";
import AdminOrders from "./pages/AdminOrders";
import AdminOrderDetail from "./pages/AdminOrderDetail";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import AIBouquetBuilder from "./pages/AIBouquetBuilder";
import FlowerDeliveryTbilisi from "./pages/FlowerDeliveryTbilisi";
import FlowerShopTbilisi from "./pages/FlowerShopTbilisi";
import RoseBouquets from "./pages/RoseBouquets";
import LilyBouquets from "./pages/LilyBouquets";
import SprayRoses from "./pages/SprayRoses";
import BirthdayFlowers from "./pages/BirthdayFlowers";
import PaymentSuccess from "./pages/PaymentSuccess";
import PaymentFailed from "./pages/PaymentFailed";
import PaymentPending from "./pages/PaymentPending";
import Delivery from "./pages/Delivery";
import Returns from "./pages/Returns";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import RedesignPreview from "./pages/RedesignPreview";

function Router() {
  const [location] = useLocation();
  const [isInitialMount, setIsInitialMount] = useState(true);

  // Track page views for Facebook Pixel on route changes (skip initial mount to avoid duplicate)
  useEffect(() => {
    if (isInitialMount) {
      setIsInitialMount(false);
      return;
    }
    trackPageView();
  }, [location, isInitialMount]);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      const main = document.querySelector("main");
      if (main) main.id = "main-content";
    });
    return () => window.cancelAnimationFrame(frame);
  }, [location]);

  // make sure to consider if you need authentication for certain routes
  return (
    <Switch>
      <Route path="/polished-fallback" component={Home} />
      <Route path="/" component={RedesignPreview} />
      <Route path="/redesign-preview" component={RedesignPreview} />
      <Route path="/catalog" component={Catalog} />
      <Route path="/product/:id" component={ProductDetail} />
      <Route path="/cart" component={Cart} />
      <Route path="/checkout" component={Checkout} />
      <Route path="/wishlist" component={Wishlist} />
      <Route path="/about" component={About} />
      <Route path="/contact" component={Contact} />
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route path="/profile" component={Profile} />
      <Route path="/admin" component={Admin} />
      <Route path="/admin/settings" component={Admin} />
      <Route path="/bouquet-builder" component={AIBouquetBuilder} />
      <Route
        path="/flower-delivery-tbilisi"
        component={FlowerDeliveryTbilisi}
      />
      <Route path="/flower-shop-tbilisi" component={FlowerShopTbilisi} />
      <Route path="/rose-bouquets" component={RoseBouquets} />
      <Route path="/lily-bouquets" component={LilyBouquets} />
      <Route path="/spray-roses" component={SprayRoses} />
      <Route path="/birthday-flowers" component={BirthdayFlowers} />
      <Route path="/admin/orders" component={AdminOrders} />
      <Route path="/admin/orders/:id" component={AdminOrderDetail} />
      <Route path="/payment/success" component={PaymentSuccess} />
      <Route path="/payment/fail" component={PaymentFailed} />
      <Route path="/payment/pending" component={PaymentPending} />
      <Route path="/delivery" component={Delivery} />
      <Route path="/returns" component={Returns} />
      <Route path="/privacy" component={Privacy} />
      <Route path="/terms" component={Terms} />
      <Route path="/404" component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  useEffect(() => {
    initFacebookPixel();
  }, []);

  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
        // switchable
      >
        <LanguageProvider>
          <CartDrawerProvider>
            <TooltipProvider>
              <Toaster />
              <Router />
            </TooltipProvider>
          </CartDrawerProvider>
        </LanguageProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
