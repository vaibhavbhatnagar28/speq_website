import React from "react";
import ReactDOM from "react-dom/client"; // Updated import
import { BrowserRouter as Router } from "react-router-dom";
import App from "./App";

// Create a root element and render the app
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Router>
    <App />
  </Router>
);
