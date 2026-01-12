import React from "react";
import { createRoot } from "react-dom/client";

const App: React.FC = () => (
  <div style={{ fontFamily: "'Cairo', sans-serif", padding: 20 }}>
    مرحباً — تطبيق تجريبي
  </div>
);

const container = document.getElementById("root");
if (!container) {
  throw new Error("Root container not found. Ensure index.html has <div id=\"root\"></div>");
}
createRoot(container).render(<App />);
