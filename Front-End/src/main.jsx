import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HashRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import App from "./App.jsx";
import "./index.css";
import { GoogleOAuthProvider } from "@react-oauth/google";

const clientId =
  "249431108114-gbv8cniho9utvspi8nhqdpc3f3j51d7g.apps.googleusercontent.com";
// const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={clientId}>
      <HashRouter>
        <Toaster position="top-center" />
        <App />
      </HashRouter>
    </GoogleOAuthProvider>
  </StrictMode>
);
