import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { AuthProvider } from './contexts/AuthContext' // Import เข้ามา
import './index.css'
import { CartProvider } from './contexts/CartContext.tsx'
import React from 'react'
import ReactDOM from 'react-dom/client'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider> {/* ครอบ AuthProvider ไว้ที่ Root */}
      <App />
    </AuthProvider>
  </StrictMode>,
)

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>    
      <CartProvider>  {/* <--- ครอบตรงนี้ */}
        <App />
      </CartProvider> {/* <--- และปิดตรงนี้ */}    
  </React.StrictMode>,
)