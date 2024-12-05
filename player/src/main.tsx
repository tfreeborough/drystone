import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import Initializer from "./Initializer.tsx";

import "@shared/styles/reset.scss";
import "@shared/styles/root.scss";

import "./index.scss";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Initializer />
  </StrictMode>,
);
