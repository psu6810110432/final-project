import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../contexts/AuthContext"; 
import { useCart } from "../contexts/CartContext"; // ✅ 1. เพิ่มบรรทัดนี้
import "./Navbar.css";

const Navbar = () => {
  const { user, logout } = useAuth();
  const { resetCart } = useCart(); // ✅ 2. ดึง resetCart มาใช้ (ต้องไปเพิ่มใน CartContext ก่อนนะ)
  
  // *ถ้าใน CartContext ไม่มี resetCart ให้ใช้บรรทัดนี้แทนชั่วคราว:
  // const { setCartItems } = useCart(); // (แต่วิธีนี้ต้องแก้ CartContext ให้ส่ง setCartItems ออกมาด้วย)

  const navigate = useNavigate();
  const [click, setClick] = useState(false);

  const handleClick = () => setClick(!click);
  const closeMobileMenu = () => setClick(false);

  const handleLogout = () => {
    // ✅ 3. ล้างตะกร้าหน้าบ้านทิ้งทันที
    if (resetCart) {
       resetCart(); 
    }
    
    logout(); // ล้าง Token และ User
    closeMobileMenu();
    navigate("/login"); // เด้งไปหน้า Login
    
    // บังคับ Reload หน้าเว็บ 1 ที เพื่อความชัวร์ว่า State ทุกอย่างหายเกลี้ยง (Optional)
    // window.location.reload(); 
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* ... (ส่วน Logo เหมือนเดิม) ... */}
        <Link to="/" className="navbar-logo" onClick={closeMobileMenu}>
          HomeAlright
        </Link>

        <div className="menu-icon" onClick={handleClick}>
          <i className={click ? "fas fa-times" : "fas fa-bars"} />
        </div>

        <ul className={click ? "nav-menu active" : "nav-menu"}>
          <li className="nav-item">
            <Link to="/home" className="nav-links" onClick={closeMobileMenu}>
              สินค้า
            </Link>
          </li>
          
          {user ? (
            <>
               {/* ... (เมนู Admin เหมือนเดิม) ... */}
              {user.role === 'admin' && (
                <li className="nav-item">
                  <Link to="/admin" className="nav-links" style={{ color: '#ff4d4d' }} onClick={closeMobileMenu}>
                    ระบบหลังบ้าน (Admin)
                  </Link>
                </li>
              )}

              <li className="nav-item">
                <Link to="/cart" className="nav-links" onClick={closeMobileMenu}>
                  ตะกร้า
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/orders" className="nav-links" onClick={closeMobileMenu}>
                  ประวัติสั่งซื้อ
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/profile" className="nav-links" onClick={closeMobileMenu}>
                  คุณ {user.username}
                </Link>
              </li>
              <li className="nav-item">
                <span 
                  className="nav-links cursor-pointer" 
                  onClick={handleLogout} // ✅ เรียกใช้ handleLogout ที่เราแก้ข้างบน
                  style={{ cursor: 'pointer' }}
                >
                  ออกจากระบบ
                </span>
              </li>
            </>
          ) : (
            <>
              <li className="nav-item">
                <Link to="/login" className="nav-links" onClick={closeMobileMenu}>
                  เข้าสู่ระบบ
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/register" className="nav-links" onClick={closeMobileMenu}>
                  สมัครสมาชิก
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;