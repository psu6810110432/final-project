import React, { useState } from "react";
import "./AdminDashboard.css";
import { createProduct } from "../services/api"; // [เพิ่ม] import api

const AdminDashboard: React.FC = () => {
  // [แก้ไข] สร้าง State เก็บข้อมูลสินค้า
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    category: "",
    stock: "",
    color: "",      // ถ้า backend มี field นี้
    material: "",   // ถ้า backend มี field นี้
    image: "",
    description: "",
  });

  // [เพิ่ม] ฟังก์ชันจัดการเมื่อพิมพ์ข้อมูล
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleConfirm = async () => {
    try {
        // แปลงข้อมูลให้ตรงกับ Type ที่ Backend ต้องการ (เช่น price, stock ต้องเป็น number)
        const payload = {
            ...formData,
            price: parseFloat(formData.price),
            stock: parseInt(formData.stock),
            // color, material ส่งไปได้ถ้า backend รองรับ หรือเก็บรวมใน description ตาม design
        };

        await createProduct(payload); // เรียก API
        alert("เพิ่มสินค้าสำเร็จ!");
        
        // ล้างค่าในฟอร์มหลังเพิ่มเสร็จ
        setFormData({
            name: "", price: "", category: "", stock: "", color: "", material: "", image: "", description: ""
        });
    } catch (error) {
        console.error("Error creating product:", error);
        alert("เกิดข้อผิดพลาดในการเพิ่มสินค้า");
    }
  };

  return (
    <div className="admin-container">
      <div className="admin-body">
        <div className="main-section">
          <div className="product-form">
            {/* Image Upload Preview */}
            <div className="image-upload">
              {formData.image ? (
                <img src={formData.image} alt="preview" className="preview-img" />
              ) : (
                <div className="upload-placeholder">
                  <span>🖼️</span>
                  <div className="plus-icon">＋</div>
                </div>
              )}
            </div>

            {/* Form Fields: ต้องใส่ name, value, onChange ให้ครบทุกช่อง */}
            <div className="form-fields">
              <div className="row">
                <input 
                  name="name" 
                  placeholder="เพิ่มสินค้า (ชื่อ)" 
                  value={formData.name} 
                  onChange={handleChange} 
                />
                <input 
                  name="price" 
                  type="number"
                  placeholder="เพิ่มราคาสินค้า" 
                  value={formData.price} 
                  onChange={handleChange} 
                />
              </div>

              <div className="row">
                <input 
                  name="category" 
                  placeholder="เพิ่มหมวดหมู่สินค้า" 
                  value={formData.category} 
                  onChange={handleChange} 
                />
                <input 
                  name="stock" 
                  type="number"
                  placeholder="เพิ่มจำนวนสินค้า" 
                  value={formData.stock} 
                  onChange={handleChange} 
                />
              </div>

              <div className="row">
                <input 
                  name="color" 
                  placeholder="เพิ่มสีสินค้า" 
                  value={formData.color} 
                  onChange={handleChange} 
                />
              </div>

              <div className="row">
                <input 
                  name="material" 
                  placeholder="เพิ่มวัสดุสินค้า" 
                  value={formData.material} 
                  onChange={handleChange} 
                />
              </div>

              {/* Image URL Input */}
              <div className="row">
                <input
                  name="image"
                  placeholder="เพิ่ม Image Address (URL)"
                  value={formData.image}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          {/* Description Section */}
          <div className="description-section">
            <input
              className="full-input"
              name="description"
              placeholder="เพิ่มรายละเอียดสินค้า (สั้นๆ)"
              value={formData.description}
              onChange={handleChange}
            />
            <textarea
              className="full-textarea"
              placeholder="เพิ่มรายละเอียดเพิ่มเติมสินค้า (ถ้ามี)"
            />
          </div>

          <div style={{ marginTop: "25px", textAlign: "center" }}>
            <button className="confirm-btn" onClick={handleConfirm}>
              ยืนยันการเพิ่มสินค้า
            </button>
          </div>
        </div>

        {/* Sidebar */}
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