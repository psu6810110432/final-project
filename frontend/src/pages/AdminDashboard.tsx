import React, { useState, useEffect } from "react";
import "./AdminDashboard.css";
// Import API
import { createProduct, getAllCategories, createCategory,type Category } from "../services/api";

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
  const [price, setPrice] = useState("");
  const [categoryId, setCategoryId] = useState(""); // เปลี่ยนจาก string เป็นเก็บ ID หรือ Name ตามสะดวก (ในที่นี้เก็บ Name เพื่อความง่ายในการส่ง)
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  // State สำหรับ Categories
  const [categoriesList, setCategoriesList] = useState<Category[]>([]);
  const [newCategoryName, setNewCategoryName] = useState("");

  // State สำหรับ Variants
  const [variants, setVariants] = useState<Variant[]>([
    { color: "", material: "", size: "", price: "", stock: "" },
  ]);

  // Load Categories on Mount
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const data = await getAllCategories();
      setCategoriesList(data);
    } catch (error) {
      console.error("Failed to fetch categories", error);
    }
  };

  // ฟังก์ชันสร้าง Category ใหม่
  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) return;
    try {
      await createCategory(newCategoryName);
      setNewCategoryName(""); // Clear input
      fetchCategories(); // Refresh list
      alert("เพิ่มหมวดหมู่สำเร็จ!");
    } catch (error) {
      console.error("Error creating category:", error);
      alert("เกิดข้อผิดพลาดในการสร้างหมวดหมู่");
    }
  };

  // ฟังก์ชันจัดการ input ของ Variant
  const handleVariantChange = (index: number, field: keyof Variant, value: string) => {
    const newVariants = [...variants];
    newVariants[index][field] = value;
    setVariants(newVariants);
  };

  const addVariant = () => {
    setVariants([...variants, { color: "", material: "", size: "", price: "", stock: "" }]);
  };

  const removeVariant = (index: number) => {
    const newVariants = variants.filter((_, i) => i !== index);
    setVariants(newVariants);
  };

  const handleConfirm = async () => {
    try {
      const payload = {
        name,
        price: parseFloat(price),
        category: categoryId, // ส่งค่า Category ที่เลือก
        description,
        image: imageUrl,
        variants: variants.map(v => ({
          ...v,
          price: parseFloat(v.price),
          stock: parseInt(v.stock)
        }))
      };

      console.log("Sending Payload:", payload);
      await createProduct(payload); // เรียกใช้ API จริง
      alert("บันทึกสินค้าเรียบร้อยแล้ว");
      
      // Reset Form (Optional)
      setName(""); setPrice(""); setDescription(""); setImageUrl("");
      setVariants([{ color: "", material: "", size: "", price: "", stock: "" }]);

    } catch (error) {
      console.error("Error adding product:", error);
      alert("เกิดข้อผิดพลาดในการเพิ่มสินค้า");
    }
  };

  return (
    <div className="admin-container">
      <div className="admin-body">
        {/* LEFT & CENTER SECTION */}
        <div className="main-section">
          <div className="product-form">
            <div className="image-upload">
              {imageUrl ? (
                <img src={imageUrl} alt="preview" className="preview-img" />
              ) : (
                <div className="upload-placeholder"><span>🖼️</span></div>
              )}
            </div>

            <div className="form-fields">
              <div className="row">
                <input placeholder="ชื่อสินค้า" value={name} onChange={e => setName(e.target.value)} />
                <input placeholder="ราคาเริ่มต้น" type="number" value={price} onChange={e => setPrice(e.target.value)} />
              </div>
              <div className="row">
                {/* เปลี่ยน Input หมวดหมู่ เป็น Select Dropdown */}
                <select 
                  value={categoryId} 
                  onChange={e => setCategoryId(e.target.value)}
                  style={{ flex: 1, padding: '10px', borderRadius: '20px', border: 'none', backgroundColor: '#f8f8f8', boxShadow: '0 3px 5px rgba(0,0,0,0.1)' }}
                >
                  <option value="">-- เลือกหมวดหมู่ --</option>
                  {categoriesList.map(cat => (
                    <option key={cat.id} value={cat.name}>{cat.name}</option>
                  ))}
                </select>
                <input placeholder="Image URL" value={imageUrl} onChange={e => setImageUrl(e.target.value)} />
              </div>
            </div>
          </div>

          <div className="description-section">
            <textarea className="full-textarea" placeholder="รายละเอียดสินค้า" value={description} onChange={e => setDescription(e.target.value)} />
          </div>

          <div className="variants-section" style={{ marginTop: '20px' }}>
            <h3>ตัวเลือกสินค้า (สี, วัสดุ, ขนาด)</h3>
            {variants.map((variant, index) => (
              <div key={index} className="variant-row" style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                <input placeholder="สี" value={variant.color} onChange={e => handleVariantChange(index, 'color', e.target.value)} style={{flex: 1}} />
                <input placeholder="วัสดุ" value={variant.material} onChange={e => handleVariantChange(index, 'material', e.target.value)} style={{flex: 1}} />
                <input placeholder="ขนาด" value={variant.size} onChange={e => handleVariantChange(index, 'size', e.target.value)} style={{flex: 1}} />
                <input placeholder="ราคา" type="number" value={variant.price} onChange={e => handleVariantChange(index, 'price', e.target.value)} style={{width: '80px'}} />
                <input placeholder="จำนวน" type="number" value={variant.stock} onChange={e => handleVariantChange(index, 'stock', e.target.value)} style={{width: '80px'}} />
                
                {variants.length > 1 && (
                  <button onClick={() => removeVariant(index)} style={{ background: 'red', color: 'white', border: 'none', cursor: 'pointer', borderRadius: '5px' }}>X</button>
                )}
              </div>
            ))}
            <button onClick={addVariant} style={{ background: '#4CAF50', color: 'white', padding: '5px 10px', border: 'none', cursor: 'pointer', borderRadius: '5px' }}>+ เพิ่มตัวเลือก</button>
          </div>

          <div style={{ marginTop: "25px", textAlign: "center" }}>
            <button className="confirm-btn" onClick={handleConfirm}>ยืนยันการเพิ่มสินค้า</button>
          </div>
        </div>
        
        {/* RIGHT SECTION (SIDEBAR) */}
        <div className="side-section">
          <h3>หมวดหมู่สินค้า</h3>
          
          {/* List Categories */}
          <div className="category-list">
            {categoriesList.map((cat) => (
              <div key={cat.id} className="category-item">
                {cat.name}
              </div>
            ))}
          </div>

          {/* Add Category Form */}
          <div className="add-category-box">
             <input 
                placeholder="ชื่อหมวดหมู่ใหม่..." 
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
             />
             <button className="orange-btn" onClick={handleAddCategory} style={{width: '100%', marginTop: '10px'}}>
               + สร้างหมวดหมู่
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;