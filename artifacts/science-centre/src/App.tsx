import { lazy, Suspense } from "react";
import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "@/pages/home";

const Products = lazy(() => import("@/pages/products"));
const ProductDetail = lazy(() => import("@/pages/product-detail"));
const About = lazy(() => import("@/pages/about"));
const SolutionsPage = lazy(() => import("@/pages/solutions"));
const PartnersPage = lazy(() => import("@/pages/partners"));
const ContactPage = lazy(() => import("@/pages/contact"));
const EventsPage = lazy(() => import("@/pages/events"));
const EventsAdminPage = lazy(() => import("@/pages/events-admin"));
const NotFound = lazy(() => import("@/pages/not-found"));

const queryClient = new QueryClient();

function Router() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/products" component={Products} />
        <Route path="/products/:id" component={ProductDetail} />
        <Route path="/events" component={EventsPage} />
        <Route path="/admin/events" component={EventsAdminPage} />
        <Route path="/solutions" component={SolutionsPage} />
        <Route path="/partners" component={PartnersPage} />
        <Route path="/contact" component={ContactPage} />
        <Route path="/about" component={About} />
        <Route component={NotFound} />
      </Switch>
    </Suspense>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
