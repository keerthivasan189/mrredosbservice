import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AuthProvider } from "@/hooks/useAuth";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import AdminPanel from "./pages/AdminPanel";
import NotFound from "./pages/NotFound";
import ServicesPage from "./pages/ServicesPage";
import HowItWorksPage from "./pages/HowItWorksPage";
import BookingPage from "./pages/BookingPage";
import ReviewsPage from "./pages/ReviewsPage";
import FAQPage from "./pages/FAQPage";
import ServiceAreaPage from "./pages/ServiceAreaPage";
import ContactPage from "./pages/ContactPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/services" element={<ServicesPage />} />
              <Route path="/how-it-works" element={<HowItWorksPage />} />
              <Route path="/book-now" element={<BookingPage />} />
              <Route path="/reviews" element={<ReviewsPage />} />
              <Route path="/faq" element={<FAQPage />} />
              <Route path="/service-areas" element={<ServiceAreaPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/login" element={<Login />} />
              <Route
                path="/dashboard/*"
                element={
                  <ProtectedRoute requiredRoles={["customer"]}>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/*"
                element={
                  <ProtectedRoute requiredRoles={["staff", "super_admin"]}>
                    <AdminPanel />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
