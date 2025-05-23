
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AdminLogin from "./pages/AdminLogin";
import Admin from "./pages/Admin";

const queryClient = new QueryClient();

// Update favicon
const updateFavicon = () => {
  const link = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
  if (link) {
    link.href = "/lovable-uploads/72888aac-b824-42d4-b008-29c54e8afac6.png";
  } else {
    const newLink = document.createElement('link');
    newLink.rel = 'icon';
    newLink.href = "/lovable-uploads/72888aac-b824-42d4-b008-29c54e8afac6.png";
    document.head.appendChild(newLink);
  }
};

// Component to update favicon on route change
const FaviconUpdater = () => {
  const location = useLocation();
  
  useEffect(() => {
    updateFavicon();
  }, [location]);
  
  return null;
};

const App = () => {
  useEffect(() => {
    updateFavicon();
  }, []);
  
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <FaviconUpdater />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/admin-login" element={<AdminLogin />} />
            <Route path="/admin" element={<Admin />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
