import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { UserProvider } from "./contexts/userContext"; // ✅ import

createRoot(document.getElementById('root')).render(
  <StrictMode>
     <UserProvider> {/* ✅ Wrap here */}
    <App />
    </UserProvider>
  </StrictMode>,
)
