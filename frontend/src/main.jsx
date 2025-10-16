import { createRoot } from "react-dom/client";
import "./index.css";
import "./style.css";
import App from "./App.jsx";
import { StyleProvider } from "./context/StyleContext.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";

createRoot(document.getElementById("root")).render(
  <>
    <AuthProvider>
      <StyleProvider>
        <App />
      </StyleProvider>
    </AuthProvider>
  </>
);
  