import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Star, Minus, Plus, ShoppingCart, Check, User, ChevronRight } from 'lucide-react';
import Navbar from '../components/Navbar'; // อย่าลืม import Navbar ถ้าใช้แยก

const ProductDetail = () => {
  const { id } = useParams();
  
  // --- STATE ---
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState('brown');
  const [addInstallation, setAddInstallation] = useState(false);

  // --- MOCK DATA (จำลองข้อมูลให้ตรงกับรูป) ---
  const product = {
    name: "โซฟาหนัง",
    price: 80000,
    sku: "HA-SF-2024-080",
    rating: 4.8,
    reviews: 124,
    description: [
      "มีความทันสมัย",
      "โซฟาดีไซน์เรียบง่ายโอบอุ้มด้วยเบาะนั่งและพนักพิงบุผ้า เพื่อความสบายและสไตล์ที่ลงตัว"
    ],
    stock: 789,
    images: [
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80", // สีส้ม (Main)
      "https://images.unsplash.com/photo-1550226891-ef816aed4a98?auto=format&fit=crop&w=800&q=80", // สีเขียว
      "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=800&q=80", // สีขาว
    ],
    colors: [
      { id: 'brown', name: 'น้ำตาล', code: '#C68E5F' },
      { id: 'green', name: 'เขียวเข้ม', code: '#1A3C34' },
      { id: 'white', name: 'ขาว', code: '#F5F5F5' }
    ]
  };

  // --- LOGIC คำนวณราคา (ตามรูปที่คุณส่งมา) ---
  const installationPrice = 400; 
  // ราคารวม = (ราคาสินค้า x จำนวน) + (ค่าติดตั้ง x จำนวน ถ้าเลือก)
  const totalPrice = (product.price * quantity) + (addInstallation ? installationPrice * quantity : 0);

  return (
    <div className="bg-gray-50 min-h-screen pb-10">
      {/* ถ้ามี Navbar ใส่ตรงนี้ หรือใส่ใน App.tsx แล้ว */}
      
      <div className="container mx-auto px-4 py-6">
        
        {/* Breadcrumb (แถบนำทางด้านบน) */}
        <div className="text-sm text-gray-500 mb-4 flex items-center gap-2">
           Home <ChevronRight size={14}/> Living Room <ChevronRight size={14}/> <span className="text-[#148F96] font-bold">โซฟาหนัง</span>
        </div>

        {/* --- ส่วนบน: รูปภาพ และ ข้อมูลสินค้า --- */}
        <div className="bg-white rounded-xl shadow-sm p-6 grid grid-cols-1 lg:grid-cols-2 gap-8 mb-6">
          
          {/* LEFT: Image Gallery */}
          <div className="flex gap-4 h-[450px]">
            {/* Thumbnails (ซ้ายสุด) */}
            <div className="flex flex-col gap-3 w-20">
              {product.images.map((img, index) => (
                <button 
                  key={index}
                  onMouseEnter={() => setSelectedImage(index)}
                  className={`w-full aspect-square rounded-lg overflow-hidden border-2 transition-all ${selectedImage === index ? 'border-[#D65A31]' : 'border-transparent'}`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
            
            {/* Main Image */}
            <div className="flex-1 bg-gray-100 rounded-lg overflow-hidden relative">
               <img src={product.images[selectedImage]} alt={product.name} className="w-full h-full object-cover" />
            </div>
          </div>

          {/* RIGHT: Product Info */}
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">{product.name}</h1>
            <div className="text-[#D65A31] text-3xl font-bold mb-1">
              ฿ {product.price.toLocaleString()}.- <span className="text-sm text-gray-500 font-normal">/ ชิ้น</span>
            </div>
            <p className="text-gray-400 text-xs mb-4">รหัสสินค้า: {product.sku}</p>
            
            {/* Rating */}
            <div className="flex items-center gap-1 mb-4">
              {[...Array(5)].map((_, i) => (
                 <Star key={i} size={16} className={i < Math.floor(product.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"} />
              ))}
              <span className="text-gray-500 text-sm ml-2">{product.rating}/5 ({product.reviews} รีวิว)</span>
            </div>

            {/* Description Bullets */}
            <ul className="list-disc list-inside text-gray-600 text-sm mb-6 space-y-1">
              {product.description.map((desc, i) => <li key={i}>{desc}</li>)}
            </ul>

            {/* Selectors Group */}
            <div className="space-y-5 border-t border-gray-100 pt-5">
              
              {/* 1. สี */}
              <div>
                <span className="font-bold text-gray-800 block mb-2">สี</span>
                <div className="flex gap-3">
                  {product.colors.map((color) => (
                    <button 
                      key={color.id}
                      onClick={() => setSelectedColor(color.id)}
                      className={`w-8 h-8 rounded-full border border-gray-300 shadow-sm ${selectedColor === color.id ? 'ring-2 ring-offset-2 ring-[#D65A31]' : ''}`}
                      style={{ backgroundColor: color.code }}
                    />
                  ))}
                </div>
              </div>

              {/* 2. วัสดุ (Checkbox Style) */}
              <div>
                 <span className="font-bold text-gray-800 block mb-2">วัสดุ</span>
                 <label className="flex items-center gap-2 cursor-pointer w-fit">
                   <input type="checkbox" defaultChecked className="accent-[#148F96] w-4 h-4 rounded" />
                   <span className="text-gray-600 text-sm">ทำจากหนัง พร้อมขาไม้เนื้อแข็ง</span>
                 </label>
              </div>

               {/* 3. ขนาด (Checkbox Style) */}
               <div>
                 <span className="font-bold text-gray-800 block mb-2">ขนาด</span>
                 <label className="flex items-center gap-2 cursor-pointer w-fit">
                   <input type="checkbox" defaultChecked className="accent-[#148F96] w-4 h-4 rounded" />
                   <span className="text-gray-600 text-sm">210ซม. (ก) x 85ซม. (ล) x 80ซม. (ส)</span>
                 </label>
              </div>

              {/* 4. Quantity & Button */}
              <div className="flex items-end gap-6 pt-4">
                <div>
                    <div className="flex items-center border border-gray-300 rounded overflow-hidden">
                      <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-2 hover:bg-gray-100"><Minus size={16}/></button>
                      <input type="text" value={quantity} readOnly className="w-10 text-center text-sm font-bold border-x border-gray-300 py-2"/>
                      <button onClick={() => setQuantity(quantity + 1)} className="p-2 hover:bg-gray-100"><Plus size={16}/></button>
                    </div>
                    <p className="text-[10px] text-gray-400 mt-1 text-center">มีสินค้าพร้อมส่ง {product.stock} ชิ้น</p>
                </div>

                <button className="bg-[#D65A31] hover:bg-[#b54622] text-white py-3 px-8 rounded font-bold text-lg shadow-lg flex items-center gap-2 transition-transform active:scale-95">
                  เพิ่มลงตะกร้า
                </button>
              </div>

            </div>
          </div>
        </div>

        {/* --- ส่วนล่าง: รีวิว และ บริการติดตั้ง --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Bottom: Reviews (กินพื้นที่ 2 ส่วน) */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6">
             <h2 className="text-xl font-bold text-gray-800 mb-6">รีวิว</h2>
             
             {/* Score Summary */}
             <div className="flex flex-col sm:flex-row gap-8 mb-8">
                <div className="text-center sm:text-left min-w-[120px]">
                  <div className="text-5xl font-bold text-gray-800">{product.rating} <span className="text-xl text-gray-400 font-normal">/5</span></div>
                  <div className="text-gray-400 text-sm">({product.reviews} รีวิว)</div>
                  <div className="flex justify-center sm:justify-start mt-2">
                    {[...Array(5)].map((_, i) => <Star key={i} size={14} className="fill-yellow-400 text-yellow-400" />)}
                  </div>
                </div>
                
                {/* Star Bars */}
                <div className="flex-1 space-y-1">
                    {[5, 4, 3, 2, 1].map((star) => (
                        <div key={star} className="flex items-center gap-2">
                            <div className="flex items-center w-12 gap-1 text-xs text-gray-500">
                                <Star size={10} className="fill-yellow-400 text-yellow-400"/> {star}
                            </div>
                            <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                                <div className="h-full bg-yellow-400" style={{ width: star === 5 ? '80%' : star === 4 ? '15%' : '2%' }}></div>
                            </div>
                            <span className="text-xs text-gray-400 w-6">{star === 5 ? 104 : star === 4 ? 15 : 0}</span>
                        </div>
                    ))}
                </div>
             </div>

             {/* Review Comment Card */}
             <div className="border border-gray-200 rounded-xl p-4">
                 <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-600"><User size={16} /></div>
                    <span className="font-bold text-sm">Pattara_K.</span>
                 </div>
                 <div className="flex mb-3">
                    {[...Array(5)].map((_, i) => <Star key={i} size={12} className="fill-yellow-400 text-yellow-400" />)}
                 </div>
                 <p className="text-sm text-gray-600 mb-4">"สินค้าจริงสวยกว่าในรูปอีกค่ะ! เข้ากับคอนโดสไตล์มินิมอลของฉันได้อย่างลงตัว หนังคุณภาพดีและทำความสะอาดง่ายมาก"</p>
                 <img src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc" alt="review" className="w-48 h-32 object-cover rounded-lg" />
             </div>
          </div>

          {/* Right Bottom: Installation Service (กินพื้นที่ 1 ส่วน) */}
          <div className="bg-white rounded-xl shadow-sm p-6 h-fit">
             <h3 className="font-bold text-lg text-gray-800 mb-4 pb-2 border-b border-gray-100">บริการติดตั้ง</h3>
             
             <div className="flex items-start gap-3">
                <input 
                  type="checkbox" 
                  checked={addInstallation}
                  onChange={(e) => setAddInstallation(e.target.checked)}
                  className="mt-1 w-5 h-5 accent-[#148F96] cursor-pointer"
                />
                <div>
                   <span className="font-bold text-gray-700 block">บริการประกอบ</span>
                   <p className="text-xs text-gray-500 mt-2 leading-relaxed">
                     ค่าบริการรายชิ้น: เริ่มต้นที่ {installationPrice} บาท/ชิ้น <br/>
                     เงื่อนไข: สั่งซื้อสินค้า 4 ชิ้นขึ้นไปคิดราคาเหมาพิเศษ เพียง 990 บาท
                   </p>
                   <p className="text-[10px] text-gray-400 mt-3">
                     รับประกันงานประกอบติดตั้ง 30 วัน <br/>
                     หากพบความเสียหายจากการประกอบ ยินดีเข้าแก้ไขฟรี <br/>
                     (บริการนี้ไม่รวมงานระบบไฟฟ้าและเจาะผนัง)
                   </p>
                </div>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProductDetail;