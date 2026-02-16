import React, { useState } from "react";
import "./AdminDashboard.css";
// import axios from "axios"; // อย่าลืม import axios หรือ api instance ของคุณ

// Interface สำหรับ Variant
interface Variant {
  color: string;
  material: string;
  size: string;
  price: string;
  stock: string;
}

const AdminDashboard: React.FC = () => {
  // State ข้อมูลหลัก
  const [name, setName] = useState("");
  const [price, setPrice] = useState(""); // ราคาเริ่มต้น
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  // State สำหรับ Variants (เริ่มต้นมี 1 แถว)
  const [variants, setVariants] = useState<Variant[]>([
    { color: "", material: "", size: "", price: "", stock: "" },
  ]);

  // ฟังก์ชันจัดการ input ของ Variant แต่ละแถว
  const handleVariantChange = (index: number, field: keyof Variant, value: string) => {
    const newVariants = [...variants];
    newVariants[index][field] = value;
    setVariants(newVariants);
  };

  // ฟังก์ชันเพิ่มแถว Variant
  const addVariant = () => {
    setVariants([...variants, { color: "", material: "", size: "", price: "", stock: "" }]);
  };

  // ฟังก์ชันลบแถว Variant
  const removeVariant = (index: number) => {
    const newVariants = variants.filter((_, i) => i !== index);
    setVariants(newVariants);
  };

  const handleConfirm = async () => {
    // เตรียมข้อมูลส่ง Backend
    const payload = {
      name,
      price: parseFloat(price),
      category,
      description,
      image: imageUrl,
      variants: variants.map(v => ({
        ...v,
        price: parseFloat(v.price),
        stock: parseInt(v.stock)
      }))
    };

    console.log("Sending Payload:", payload);
    alert("ข้อมูลพร้อมส่ง (ดูใน Console) - กรุณาเชื่อมต่อ API");
    // await api.post('/products', payload);
  };

  return (
    <div className="admin-container">
      <div className="admin-body">
        <div className="main-section">
          <div className="product-form">
            {/* Image Upload */}
            <div className="image-upload">
              {imageUrl ? (
                <img src={imageUrl} alt="preview" className="preview-img" />
              ) : (
                <div className="upload-placeholder"><span>🖼️</span></div>
              )}
            </div>

            {/* General Info */}
            <div className="form-fields">
              <div className="row">
                <input placeholder="ชื่อสินค้า" value={name} onChange={e => setName(e.target.value)} />
                <input placeholder="ราคาเริ่มต้น" type="number" value={price} onChange={e => setPrice(e.target.value)} />
              </div>
              <div className="row">
                <input placeholder="หมวดหมู่" value={category} onChange={e => setCategory(e.target.value)} />
                <input placeholder="Image URL" value={imageUrl} onChange={e => setImageUrl(e.target.value)} />
              </div>
            </div>
          </div>

          <div className="description-section">
            <textarea className="full-textarea" placeholder="รายละเอียดสินค้า" value={description} onChange={e => setDescription(e.target.value)} />
          </div>

          {/* 👇 ส่วนจัดการ Variants (Best Practice) */}
          <div className="variants-section" style={{ marginTop: '20px' }}>
            <h3>ตัวเลือกสินค้า (สี, วัสดุ, ขนาด)</h3>
            {variants.map((variant, index) => (
              <div key={index} className="variant-row" style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                <input placeholder="สี" value={variant.color} onChange={e => handleVariantChange(index, 'color', e.target.value)} style={{flex: 1}} />
                <input placeholder="วัสดุ" value={variant.material} onChange={e => handleVariantChange(index, 'material', e.target.value)} style={{flex: 1}} />
                <input placeholder="ขนาด (กxยxส)" value={variant.size} onChange={e => handleVariantChange(index, 'size', e.target.value)} style={{flex: 1}} />
                <input placeholder="ราคา" type="number" value={variant.price} onChange={e => handleVariantChange(index, 'price', e.target.value)} style={{width: '80px'}} />
                <input placeholder="จำนวน" type="number" value={variant.stock} onChange={e => handleVariantChange(index, 'stock', e.target.value)} style={{width: '80px'}} />
                
                {variants.length > 1 && (
                  <button onClick={() => removeVariant(index)} style={{ background: 'red', color: 'white', border: 'none', cursor: 'pointer' }}>X</button>
                )}
              </div>
            ))}
            <button onClick={addVariant} style={{ background: '#4CAF50', color: 'white', padding: '5px 10px', border: 'none', cursor: 'pointer' }}>+ เพิ่มตัวเลือก</button>
          </div>

          <div style={{ marginTop: "25px", textAlign: "center" }}>
            <button className="confirm-btn" onClick={handleConfirm}>ยืนยันการเพิ่มสินค้า</button>
          </div>
        </div>
        
        <div className="side-section">
           {/* Sidebar content */}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;