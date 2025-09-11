import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

const root = createRoot(document.getElementById("root"));
const inDev = import.meta.env.DEV;

// Disable StrictMode in development to avoid React's intentional double-invocation
// of renders/effects which can make interactions feel sluggish. Keep it in production.
root.render(
  inDev ? (
    <App />
  ) : (
    <StrictMode>
      <App />
    </StrictMode>
  ),
);
