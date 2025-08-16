import React from "react";
import ReactDOM from "react-dom/client";

import "./amplify";
import "./index.css";
import App from "./App";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App /> {/* App gère déjà le Router */}
  </React.StrictMode>
);