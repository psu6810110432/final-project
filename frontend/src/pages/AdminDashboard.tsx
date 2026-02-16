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
  // State ข้อมูลหลัก
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [categoryId, setCategoryId] = useState(""); 
  const [roomId, setRoomId] = useState(""); // ✅ State เลือกห้อง
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]); // ✅ State เลือก Features (Array)
  
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  // State สำหรับ Master Data (List)
  const [categoriesList, setCategoriesList] = useState<Category[]>([]);
  const [roomsList, setRoomsList] = useState<Room[]>([]);       // ✅ List ห้อง
  const [featuresList, setFeaturesList] = useState<Feature[]>([]); // ✅ List Features

  // State สำหรับสร้าง Master Data ใหม่ (ใน Sidebar)
  const [newItemName, setNewItemName] = useState("");
  const [activeTab, setActiveTab] = useState<'category' | 'room' | 'feature'>('category'); // ✅ Tab ใน Sidebar

  // State สำหรับ Variants (เริ่มต้นมี 1 แถว)
  const [variants, setVariants] = useState<Variant[]>([
    { color: "", material: "", size: "", price: "", stock: "" },
  ]);

  // Load Data on Mount
  useEffect(() => {
    fetchMasterData();
  }, []);

  const fetchMasterData = async () => {
    try {
      // ดึงข้อมูลทั้งหมดพร้อมกัน
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

  // ฟังก์ชันจัดการ Features (Multi-select Checkbox)
  const toggleFeature = (featureName: string) => {
    setSelectedFeatures(prev => 
      prev.includes(featureName) 
        ? prev.filter(f => f !== featureName) // ถ้ามีแล้วให้เอาออก
        : [...prev, featureName]              // ถ้ายังไม่มีให้เพิ่ม
    );
  };

  // ฟังก์ชันสร้าง Master Data ใหม่ (Dynamic ตาม Tab ที่เลือก)
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
      fetchMasterData(); // Refresh list ทั้งหมด
      alert(`เพิ่ม ${activeTab} สำเร็จ!`);
    } catch (error) {
      console.error(error);
      alert("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
    }
  };

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

  // ฟังก์ชัน Confirm บันทึกสินค้า
  const handleConfirm = async () => {
    try {
      // Validate เบื้องต้น
      if (!name || !price || !categoryId) {
        alert("กรุณากรอกชื่อสินค้า, ราคา และเลือกหมวดหมู่");
        return;
      }

      const payload = {
        name,
        price: parseFloat(price),
        category: categoryId, 
        room: roomId,                 // ✅ ส่ง Room
        features: selectedFeatures,   // ✅ ส่ง Features Array
        description,
        image: imageUrl,
        variants: variants.map(v => ({
          ...v,
          price: parseFloat(v.price),
          stock: parseInt(v.stock)
        }))
      };

      console.log("Sending Payload:", payload);
      await createProduct(payload);
      alert("บันทึกสินค้าเรียบร้อยแล้ว");
      
      // Reset Form
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
        {/* MAIN SECTION (ซ้าย-กลาง) */}
        <div className="main-section">
          <div className="product-form">
            {/* Image Upload Area */}
            <div className="image-upload">
              {imageUrl ? (
                  <img src={imageUrl} alt="preview" className="preview-img" />
              ) : (
                  <div className="upload-placeholder"><span>🖼️</span></div>
              )}
            </div>

            {/* General Info Inputs */}
            <div className="form-fields">
              <div className="row">
                <input placeholder="ชื่อสินค้า" value={name} onChange={e => setName(e.target.value)} />
                <input placeholder="ราคาเริ่มต้น" type="number" value={price} onChange={e => setPrice(e.target.value)} />
              </div>
              
              {/* Row 2: Category & Room (Single Select) */}
              <div className="row">
                <select 
                  value={categoryId} 
                  onChange={e => setCategoryId(e.target.value)} 
                  className="dropdown-input"
                >
                  <option value="">-- หมวดหมู่สินค้า --</option>
                  {categoriesList.map(cat => (
                    <option key={cat.id} value={cat.name}>{cat.name}</option>
                  ))}
                </select>
                
                <select 
                  value={roomId} 
                  onChange={e => setRoomId(e.target.value)} 
                  className="dropdown-input"
                >
                  <option value="">-- หมวดหมู่ห้อง --</option>
                  {roomsList.map(room => (
                    <option key={room.id} value={room.name}>{room.name}</option>
                  ))}
                </select>
              </div>

              {/* Row 3: Image URL */}
              <div className="row">
                 <input placeholder="Image URL" value={imageUrl} onChange={e => setImageUrl(e.target.value)} style={{width: '100%'}} />
              </div>

              {/* Row 4: Features (Multi Select Checkboxes) */}
              <div className="features-container" style={{background: '#f8f8f8', padding: '15px', borderRadius: '15px', marginTop: '10px'}}>
                <label style={{fontWeight: 'bold', marginBottom: '10px', display: 'block', color: '#555'}}>คุณสมบัติพิเศษ:</label>
                <div style={{display: 'flex', flexWrap: 'wrap', gap: '15px'}}>
                  {featuresList.map(feat => (
                    <label key={feat.id} style={{display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer', background: 'white', padding: '5px 10px', borderRadius: '10px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)'}}>
                      <input 
                        type="checkbox" 
                        checked={selectedFeatures.includes(feat.name)}
                        onChange={() => toggleFeature(feat.name)}
                      />
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

          {/* Variants Section */}
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
                    <button onClick={() => removeVariant(index)} style={{ background: 'red', color: 'white', border: 'none', cursor: 'pointer', borderRadius: '5px', width: '30px' }}>X</button>
                    )}
                </div>
                ))}
                <button onClick={addVariant} style={{ background: '#4CAF50', color: 'white', padding: '8px 15px', border: 'none', cursor: 'pointer', borderRadius: '5px', fontWeight: 'bold' }}>+ เพิ่มตัวเลือก</button>
          </div>

          <div style={{ marginTop: "25px", textAlign: "center" }}>
            <button className="confirm-btn" onClick={handleConfirm}>ยืนยันการเพิ่มสินค้า</button>
          </div>
        </div>
        
        {/* RIGHT SECTION (SIDEBAR) */}
        <div className="side-section">
          <h3>จัดการข้อมูลระบบ</h3>
          
          {/* Tabs Control */}
          <div style={{display: 'flex', gap: '5px', marginBottom: '15px'}}>
            <button 
                onClick={() => setActiveTab('category')}
                style={{flex: 1, padding: '8px', borderRadius: '10px', border: 'none', background: activeTab === 'category' ? '#d6451e' : '#ccc', color: 'white', cursor: 'pointer', fontWeight: 'bold'}}
            >สินค้า</button>
            <button 
                onClick={() => setActiveTab('room')}
                style={{flex: 1, padding: '8px', borderRadius: '10px', border: 'none', background: activeTab === 'room' ? '#d6451e' : '#ccc', color: 'white', cursor: 'pointer', fontWeight: 'bold'}}
            >ห้อง</button>
            <button 
                onClick={() => setActiveTab('feature')}
                style={{flex: 1, padding: '8px', borderRadius: '10px', border: 'none', background: activeTab === 'feature' ? '#d6451e' : '#ccc', color: 'white', cursor: 'pointer', fontWeight: 'bold'}}
            >คุณสมบัติ</button>
          </div>

          {/* List Display */}
          <div className="category-list">
            {activeTab === 'category' && (
                categoriesList.length > 0 ? categoriesList.map(i => <div key={i.id} className="category-item">📂 {i.name}</div>) : <p style={{textAlign:'center', color:'#999'}}>ไม่มีข้อมูล</p>
            )}
            {activeTab === 'room' && (
                roomsList.length > 0 ? roomsList.map(i => <div key={i.id} className="category-item">🏠 {i.name}</div>) : <p style={{textAlign:'center', color:'#999'}}>ไม่มีข้อมูล</p>
            )}
            {activeTab === 'feature' && (
                featuresList.length > 0 ? featuresList.map(i => <div key={i.id} className="category-item">✨ {i.name}</div>) : <p style={{textAlign:'center', color:'#999'}}>ไม่มีข้อมูล</p>
            )}
          </div>

          {/* Add Form */}
          <div className="add-category-box">
             <h4 style={{marginBottom: '10px', color: '#555'}}>เพิ่ม {activeTab === 'category' ? 'หมวดหมู่' : activeTab === 'room' ? 'ห้อง' : 'คุณสมบัติ'} ใหม่</h4>
             <input 
                placeholder={`ชื่อ${activeTab === 'category' ? 'หมวดหมู่' : activeTab === 'room' ? 'ห้อง' : 'คุณสมบัติ'}...`}
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
                style={{width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid #ddd', marginBottom: '10px'}}
             />
             <button className="orange-btn" onClick={handleAddMasterData} style={{width: '100%'}}>
               + บันทึกข้อมูล
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;