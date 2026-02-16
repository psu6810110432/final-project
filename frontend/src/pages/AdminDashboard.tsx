import React, { useState, useEffect } from "react";
import "./AdminDashboard.css";
// Import API
import { 
  createProduct, 
  getAllCategories, createCategory, type Category,
  getAllRooms, createRoom, type Room,        // ✅ เพิ่ม API ห้อง
  getAllFeatures, createFeature, type Feature // ✅ เพิ่ม API คุณสมบัติ
} from "../services/api";

// Interface สำหรับ Variant
interface Variant {
  color: string;
  material: string;
  size: string;
  price: string;
  stock: string;
}

const AdminDashboard: React.FC = () => {
  // ---------------------------------------------------------
  //  เพิ่ม State สำหรับควบคุมหน้าหลัก (เมนูขวา)
  // ---------------------------------------------------------
  const [activeView, setActiveView] = useState<'addProduct' | 'manageSystem' | 'manageOrders'>('addProduct');

  // State ข้อมูลหลัก
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [categoryId, setCategoryId] = useState(""); 
  const [roomId, setRoomId] = useState(""); 
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]); 
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  // State สำหรับ Master Data (List)
  const [categoriesList, setCategoriesList] = useState<Category[]>([]);
  const [roomsList, setRoomsList] = useState<Room[]>([]);       
  const [featuresList, setFeaturesList] = useState<Feature[]>([]); 

  // State สำหรับสร้าง Master Data ใหม่ (ย้ายจาก Sidebar เดิม)
  const [newItemName, setNewItemName] = useState("");
  const [activeTab, setActiveTab] = useState<'category' | 'room' | 'feature'>('category'); 

  // State สำหรับ Variants
  const [variants, setVariants] = useState<Variant[]>([
    { color: "", material: "", size: "", price: "", stock: "" },
  ]);

  // Load Data on Mount
  useEffect(() => {
    fetchMasterData();
  }, []);

  const fetchMasterData = async () => {
    try {
      const [cats, rms, fts] = await Promise.all([
        getAllCategories(),
        getAllRooms(),
        getAllFeatures()
      ]);
      setCategoriesList(cats);
      setRoomsList(rms);
      setFeaturesList(fts);
    } catch (error) {
      console.error("Failed to fetch master data", error);
    }
  };

  const toggleFeature = (featureName: string) => {
    setSelectedFeatures(prev => 
      prev.includes(featureName) 
        ? prev.filter(f => f !== featureName) 
        : [...prev, featureName]              
    );
  };

  const handleAddMasterData = async () => {
    if (!newItemName.trim()) return;
    try {
      if (activeTab === 'category') {
        await createCategory(newItemName);
      } else if (activeTab === 'room') {
        await createRoom(newItemName);
      } else if (activeTab === 'feature') {
        await createFeature(newItemName);
      }
      
      setNewItemName(""); 
      fetchMasterData(); 
      alert(`เพิ่ม ${activeTab} สำเร็จ!`);
    } catch (error) {
      console.error(error);
      alert("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
    }
  };

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
      if (!name || !price || !categoryId) {
        alert("กรุณากรอกชื่อสินค้า, ราคา และเลือกหมวดหมู่");
        return;
      }
      const payload = {
        name,
        price: parseFloat(price),
        category: categoryId, 
        room: roomId,                 
        features: selectedFeatures,   
        description,
        image: imageUrl,
        variants: variants.map(v => ({
          ...v,
          price: parseFloat(v.price),
          stock: parseInt(v.stock)
        }))
      };
      await createProduct(payload);
      alert("บันทึกสินค้าเรียบร้อยแล้ว");
      
      setName(""); setPrice(""); setDescription(""); setImageUrl("");
      setCategoryId(""); setRoomId(""); setSelectedFeatures([]);
      setVariants([{ color: "", material: "", size: "", price: "", stock: "" }]);
    } catch (error) {
      console.error("Error adding product:", error);
      alert("เกิดข้อผิดพลาดในการเพิ่มสินค้า");
    }
  };

  return (
    <div className="admin-container">
      <div className="admin-body">
        
        {/* ---------------------------------------------------------
                   MAIN SECTION (สลับแสดงผลตามเมนูขวา)
            --------------------------------------------------------- */}
        <div className="main-section">
          
          {/* ส่วนที่ 1: หน้าเพิ่มสินค้า (UI เดิม) */}
          {activeView === 'addProduct' && (
            <>
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
                    <select value={categoryId} onChange={e => setCategoryId(e.target.value)} className="dropdown-input">
                      <option value="">-- หมวดหมู่สินค้า --</option>
                      {categoriesList.map(cat => <option key={cat.id} value={cat.name}>{cat.name}</option>)}
                    </select>
                    <select value={roomId} onChange={e => setRoomId(e.target.value)} className="dropdown-input">
                      <option value="">-- หมวดหมู่ห้อง --</option>
                      {roomsList.map(room => <option key={room.id} value={room.name}>{room.name}</option>)}
                    </select>
                  </div>
                  <div className="row">
                    <input placeholder="Image URL" value={imageUrl} onChange={e => setImageUrl(e.target.value)} style={{width: '100%'}} />
                  </div>
                  <div className="features-container" style={{background: '#f8f8f8', padding: '15px', borderRadius: '15px', marginTop: '10px'}}>
                    <label style={{fontWeight: 'bold', marginBottom: '10px', display: 'block', color: '#555'}}>คุณสมบัติพิเศษ:</label>
                    <div style={{display: 'flex', flexWrap: 'wrap', gap: '15px'}}>
                      {featuresList.map(feat => (
                        <label key={feat.id} style={{display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer', background: 'white', padding: '5px 10px', borderRadius: '10px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)'}}>
                          <input type="checkbox" checked={selectedFeatures.includes(feat.name)} onChange={() => toggleFeature(feat.name)} />
                          <span style={{fontSize: '14px'}}>{feat.name}</span>
                        </label>
                      ))}
                    </div>
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
                        {variants.length > 1 && <button onClick={() => removeVariant(index)} style={{ background: 'red', color: 'white', border: 'none', cursor: 'pointer', borderRadius: '5px', width: '30px' }}>X</button>}
                    </div>
                ))}
                <button onClick={addVariant} style={{ background: '#4CAF50', color: 'white', padding: '8px 15px', border: 'none', cursor: 'pointer', borderRadius: '5px', fontWeight: 'bold' }}>+ เพิ่มตัวเลือก</button>
              </div>

              <div style={{ marginTop: "25px", textAlign: "center" }}>
                <button className="confirm-btn" onClick={handleConfirm}>ยืนยันการเพิ่มสินค้า</button>
              </div>
            </>
          )}

        </div>
        
        {/* ---------------------------------------------------------
                    RIGHT NAVIGATION SIDEBAR 
            --------------------------------------------------------- */}
        <div className="side-navigation">
          <div className="nav-header">จัดการระบบ</div> 
          <button 
            className={`nav-item-btn ${activeView === 'addProduct' ? 'active' : ''}`}
            onClick={() => setActiveView('addProduct')}
          >
            ➕ เพิ่มสินค้า
          </button>
          <button 
            className={`nav-item-btn ${activeView === 'manageSystem' ? 'active' : ''}`}
            onClick={() => setActiveView('manageSystem')}
          >
            ⚙️ แก้ไข/ลบคุณสมบัติ
          </button>
          <button 
            className={`nav-item-btn ${activeView === 'manageOrders' ? 'active' : ''}`}
            onClick={() => setActiveView('manageOrders')}
          >
            📦 จัดการคำสั่งซื้อ
          </button>
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;