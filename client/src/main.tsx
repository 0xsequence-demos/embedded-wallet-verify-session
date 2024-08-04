import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

import { ThemeProvider } from "@0xsequence/design-system";
import "@0xsequence/design-system/styles.css";
import { Dapp } from "./Dapp.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider>
      <Dapp />
    </ThemeProvider>
  </React.StrictMode>,
);
