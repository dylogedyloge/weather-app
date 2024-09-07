import React from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";

// Function to get URL parameters
const getUrlParameter = (name: string) => {
  name = name.replace(/[$$]/, "$$").replace(/[$$]/, "$$");
  const regex = new RegExp("[\\?&]" + name + "=([^&#]*)");
  const results = regex.exec(window.location.search);
  return results === null
    ? null
    : decodeURIComponent(results[1].replace(/\+/g, " "));
};

const latitude = getUrlParameter("lat")
  ? parseFloat(getUrlParameter("lat")!)
  : undefined;
const longitude = getUrlParameter("lon")
  ? parseFloat(getUrlParameter("lon")!)
  : undefined;

const container = document.getElementById("root");
if (container) {
  const root = createRoot(container);
  root.render(
    <React.StrictMode>
      <App latitude={latitude} longitude={longitude} />
    </React.StrictMode>
  );
} else {
  console.error("Failed to find the root element");
}
