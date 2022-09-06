import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./style/index.css";

// @Deprecated
// ReactDOM.createRoot(document.getElementById("root")!).render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>
// );

// React 18.x
function render() {
  const root = createRoot(document.getElementById("root")!);
  root.render(
    // <React.StrictMode>
      <App />
    // </React.StrictMode>
  );
}

render();
