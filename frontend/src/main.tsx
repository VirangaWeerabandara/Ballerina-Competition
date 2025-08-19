import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { AsgardeoProvider } from "@asgardeo/react";
import { StrictMode } from 'react';

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AsgardeoProvider
      clientId={import.meta.env.VITE_ASGARDEO_CLIENT_ID}
      baseUrl={import.meta.env.VITE_ASGARDEO_BASE_URL}
      scopes="openid email profile"
    >
      <App />
    </AsgardeoProvider>
  </StrictMode>
);
