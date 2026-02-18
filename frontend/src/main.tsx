import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// เหลือแค่ก้อนเดียวพอครับ ไม่ต้องครอบ Provider ตรงนี้แล้ว
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);