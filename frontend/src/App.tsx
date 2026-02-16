import { BrowserRouter, Routes, Route } from 'react-router-dom';
// เดี๋ยวเราค่อยสร้างไฟล์หน้าเหล่านี้ทีหลัง
import Home from './pages/Home'; 
import Login from './pages/Login';
import Register from './pages/Register';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Profile from './pages/Profile';
import AdminDashboard from './pages/AdminDashboard';
import Navbar from './components/Navbar'; // แถบเมนูบนสุดที่มีทุกหน้า
import { CartProvider } from './contexts/CartContext';
import { AuthProvider } from './contexts/AuthContext';

function App() {
  return (
  <AuthProvider>
    <CartProvider>
      <BrowserRouter>
        {/* Navbar อยู่เสมอทุกหน้า ยกเว้นหน้า Login อาจจะซ่อน */}
        <Navbar /> 
      
        <div className="min-h-screen bg-gray-50">
          <Routes>  
            <Route path="/home" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/admin" element={<AdminDashboard />} />
          </Routes>
        </div>
      </BrowserRouter>
    </CartProvider>
  </AuthProvider>
  );
}

export default App;