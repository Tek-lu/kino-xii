import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./index.css";
import App from "./App.jsx";
import BookingProvider from "./context/BookingProvider";
import AuthProvider from './context/AuthProvider'
const queryClient = new QueryClient();
import { ConfigProvider } from "./context/ConfigContext"




createRoot(document.getElementById("root")).render(
  <QueryClientProvider client={queryClient}>
   <ConfigProvider>
     <BrowserRouter>
       <AuthProvider>
        <BookingProvider>
          <App />
        </BookingProvider>
       </AuthProvider>
     </BrowserRouter>
   </ConfigProvider>
  </QueryClientProvider> 
);