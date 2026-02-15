import React from "react";
import "./AdminDashboard.css";

const AdminDashboard: React.FC = () => {
  return (
    <div className="admin-container">
      <div className="admin-body">
        {/* Left Main Section */}
        <div className="main-section">
          <div className="product-form">
            {/* Image Upload */}
            <div className="image-upload">
              <div className="upload-placeholder">
                <span>🖼️</span>
                <div className="plus-icon">＋</div>
              </div>
            </div>

            {/* Input Fields */}
            <div className="form-fields">
              <div className="row">
                <input placeholder="เพิ่มสินค้า" />
                <input placeholder="เพิ่มราคาสินค้า" />
              </div>

              <div className="row">
                <input placeholder="เพิ่มหมวดหมู่สินค้า" />
                <input placeholder="เพิ่มจำนวนสินค้า" />
              </div>

              <div className="row">
                <input placeholder="เพิ่มสีสินค้า" />
              </div>

              <div className="row">
                <input placeholder="เพิ่มวัสดุสินค้า" />
              </div>

              <div className="row small-inputs">
                <input placeholder="กว้าง" />
                <input placeholder="ยาว" />
                <input placeholder="สูง" />
              </div>
            </div>
          </div>

          {/* Description Section */}
          <div className="description-section">
            <input
              className="full-input"
              placeholder="เพิ่มรายละเอียดสินค้า"
            />
            <textarea
              className="full-textarea"
              placeholder="เพิ่มรายละเอียดเพิ่มเติมสินค้า"
            />
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="side-section">
          <button className="big-orange-btn">เพิ่มรายการสินค้า</button>
          <button className="side-btn">แก้ไข/ลบ</button>
          <button className="side-btn">การจัดการคำสั่งซื้อ</button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
