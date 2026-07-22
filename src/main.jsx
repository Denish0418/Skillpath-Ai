import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";

// 1. Bootstrap base — always first so our overrides can win
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "bootstrap-icons/font/bootstrap-icons.css";

// 2. Our global theme & variable overrides — AFTER Bootstrap so they take precedence
import "./styles/theme.css";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);