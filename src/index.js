import React from "react";
import ReactDOM from "react-dom";
import App from "./App";

// Contexts
import { StocksDataProvider } from "./contexts/appContext";

ReactDOM.render(
  <React.StrictMode>
    <StocksDataProvider>
      <App />
    </StocksDataProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
