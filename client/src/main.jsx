
import React from "react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { HelmetProvider } from "react-helmet-async";

import App from "./App";
import { ThemeProvider } from "./context/ThemeContext";
import "./index.css";

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <HelmetProvider>
      <GoogleOAuthProvider clientId={googleClientId}>
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </GoogleOAuthProvider>
    </HelmetProvider>
  </StrictMode>
);

if (import.meta.env.PROD && "serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js", { scope: "/" }).catch((error) => {
      console.error("GEN Learning could not enable offline app support:", error);
    });
  });
}
