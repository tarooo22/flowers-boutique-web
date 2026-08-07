import { lazy, Suspense, useEffect, useState } from "react";
import { Route, Switch, useLocation } from "wouter";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import { CartDrawerProvider } from "./contexts/CartDrawerContext";
import { initFacebookPixel, trackPageView } from "./lib/facebookPixel";

const Home = lazy(() => import("./pages/Home"));
const Catalog = lazy(() => import("./pages/Catalog"));
const ProductDetail = lazy(() => import("./pages/ProductDetail"));
const Cart = lazy(() => import("./pages/Cart"));
const Checkout = lazy(() => import("./pages/Checkout"));
const Wishlist = lazy(() => import("./pages/Wishlist"));
const Contact = lazy(() => import("./pages/Contact"));
const About = lazy(() => import("./pages/About"));
const Admin = lazy(() => import("./pages/Admin"));
const AdminOrders = lazy(() => import("./pages/AdminOrders"));
const AdminOrderDetail = lazy(() => import("./pages/AdminOrderDetail"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const Profile = lazy(() => import("./pages/Profile"));
const AIBouquetBuilder = lazy(() => import("./pages/AIBouquetBuilder"));
const FlowerDeliveryTbilisi = lazy(
  () => import("./pages/FlowerDeliveryTbilisi")
);
const FlowerShopTbilisi = lazy(() => import("./pages/FlowerShopTbilisi"));
const RoseBouquets = lazy(() => import("./pages/RoseBouquets"));
const LilyBouquets = lazy(() => import("./pages/LilyBouquets"));
const SprayRoses = lazy(() => import("./pages/SprayRoses"));
const BirthdayFlowers = lazy(() => import("./pages/BirthdayFlowers"));
const PaymentSuccess = lazy(() => import("./pages/PaymentSuccess"));
const PaymentFailed = lazy(() => import("./pages/PaymentFailed"));
const PaymentPending = lazy(() => import("./pages/PaymentPending"));
const Delivery = lazy(() => import("./pages/Delivery"));
const Returns = lazy(() => import("./pages/Returns"));
const Privacy = lazy(() => import("./pages/Privacy"));
const Terms = lazy(() => import("./pages/Terms"));
const NotFound = lazy(() => import("./pages/NotFound"));

function PageLoader() {
  return (
    <main className="p1-route-loader" aria-live="polite" aria-busy="true">
      <span className="p1-route-loader__mark" aria-hidden="true" />
      <span>Flower’s Boutique</span>
    </main>
  );
}

function LegacyHomeRedirect() {
  const [, navigate] = useLocation();
  useEffect(() => navigate("/", { replace: true }), [navigate]);
  return <PageLoader />;
}

function getRouteTone(location: string) {
  if (location.startsWith("/admin")) return "admin";
  if (location === "/bouquet-builder") return "builder";
  if (location === "/checkout") return "checkout";
  if (
    location === "/catalog" ||
    location.startsWith("/product/") ||
    location === "/cart" ||
    location === "/wishlist"
  ) {
    return "commerce";
  }
  if (
    location === "/login" ||
    location === "/register" ||
    location === "/profile"
  ) {
    return "account";
  }
  if (location.startsWith("/payment/")) return "status";
  if (["/delivery", "/returns", "/privacy", "/terms"].includes(location)) {
    return "info";
  }
  if (
    [
      "/flower-delivery-tbilisi",
      "/flower-shop-tbilisi",
      "/rose-bouquets",
      "/lily-bouquets",
      "/spray-roses",
      "/birthday-flowers",
    ].includes(location)
  ) {
    return "discovery";
  }
  if (location === "/about" || location === "/contact") return "editorial";
  return "home";
}

function Router() {
  const [location] = useLocation();
  const [isInitialMount, setIsInitialMount] = useState(true);
  const routeTone = getRouteTone(location);

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
      window.scrollTo({ top: 0, behavior: "auto" });
    });
    return () => window.cancelAnimationFrame(frame);
  }, [location]);

  return (
    <Suspense fallback={<PageLoader />}>
      <div className={`p1-app p1-app--${routeTone}`} data-route={routeTone}>
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/polished-fallback" component={LegacyHomeRedirect} />
          <Route path="/redesign-preview" component={LegacyHomeRedirect} />
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
          <Route component={NotFound} />
        </Switch>
      </div>
    </Suspense>
  );
}

function App() {
  useEffect(() => initFacebookPixel(), []);

  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
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
