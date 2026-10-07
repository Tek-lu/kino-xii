import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./index.css";
import App from "./App.jsx";
import AuthProvider from './context/AuthProvider'
const queryClient = new QueryClient();
import { ConfigProvider } from "./context/ConfigContext"




createRoot(document.getElementById("root")).render(
  <QueryClientProvider client={queryClient}>
   <ConfigProvider>
     <BrowserRouter>
       <AuthProvider>
         <App />
       </AuthProvider>
     </BrowserRouter>
   </ConfigProvider>
  </QueryClientProvider> 
);