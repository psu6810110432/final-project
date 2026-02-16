import { useState } from 'react';
import { Trash2, Minus, Plus, MapPin, X, Upload, ScanLine } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const navigate = useNavigate();
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  // --- MOCK DATA: สินค้าในตะกร้า ---
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "ชั้นวางแบบสามเสา",
      detail: "ไม้โอ๊ค, 72 ซม.",
      price: 36500,
      quantity: 1,
      image: "https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=300&q=80"
    },
    {
      id: 2,
      name: "เก้าอี้เสริม",
      detail: "สีเทาอ่อน ขนาด 84x72 ซม.",
      price: 35000,
      quantity: 4,
      image: "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=300&q=80"
    }
  ]);

  // คำนวณยอดรวม
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const installationFee = 80;
  const shippingFee = 150;
  const total = subtotal + installationFee + shippingFee;

  // ฟังก์ชันปรับจำนวน
  const updateQuantity = (id: number, delta: number) => {
    setCartItems(items => items.map(item => 
      item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
    ));
  };

  // ฟังก์ชันลบสินค้า
  const removeItem = (id: number) => {
    setCartItems(items => items.filter(item => item.id !== id));
  };

  return (
    <div className="bg-gray-50 min-h-screen py-10 font-sans">
      <div className="container mx-auto px-4">
        
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
           <div className="bg-white px-6 py-2 rounded-lg shadow-sm font-bold text-lg text-gray-800">
             ตะกร้าสินค้า
           </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* --- LEFT COLUMN: รายการสินค้า --- */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <div key={item.id} className="bg-white p-4 rounded-xl shadow-sm flex flex-col sm:flex-row items-center gap-4 relative">
                {/* Delete Button (Top Right) */}
                <button 
                  onClick={() => removeItem(item.id)}
                  className="absolute top-4 right-4 text-gray-400 hover:text-red-500"
                >
                  <Trash2 size={18} />
                </button>

                {/* Image */}
                <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>

                {/* Info */}
                <div className="flex-1 text-center sm:text-left">
                  <h3 className="font-bold text-gray-800">{item.name}</h3>
                  <p className="text-gray-400 text-xs mb-2">{item.detail}</p>
                  <div className="font-bold text-gray-800">฿{item.price.toLocaleString()}</div>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center bg-gray-100 rounded-lg px-2 py-1">
                   <button onClick={() => updateQuantity(item.id, -1)} className="p-1 hover:text-gray-600"><Minus size={14}/></button>
                   <span className="mx-3 text-sm font-bold w-4 text-center">{item.quantity}</span>
                   <button onClick={() => updateQuantity(item.id, 1)} className="p-1 hover:text-gray-600"><Plus size={14}/></button>
                </div>
              </div>
            ))}
          </div>

          {/* --- RIGHT COLUMN: สรุปยอด & ที่อยู่ --- */}
          <div className="space-y-6">
            
            {/* Address Card */}
            <div className="bg-white p-5 rounded-xl shadow-sm">
               <div className="flex justify-between items-center mb-3">
                 <h3 className="font-bold text-gray-800">ที่อยู่จัดส่ง</h3>
                 <button className="text-blue-500 text-xs">คลิกเพื่อเปลี่ยน</button>
               </div>
               <div className="bg-[#EBF1F5] p-4 rounded-lg text-xs text-gray-600 leading-relaxed flex gap-3">
                  <MapPin size={24} className="text-gray-400 flex-shrink-0 mt-1" />
                  <div>
                    <span className="font-bold text-gray-800 block mb-1">คุณ Pattara_K (+66)84 xxx xxxx</span>
                    มหาวิทยาลัยสงขลา<br/>
                    15 ถนน กาญจนวนิชย์ คอหงส์ อำเภอหาดใหญ่<br/>
                    สงขลา 90110
                  </div>
               </div>
            </div>

            {/* Order Summary */}
            <div className="bg-white p-5 rounded-xl shadow-sm">
              <div className="space-y-3 text-sm text-gray-600 mb-6">
                <div className="flex justify-between">
                  <span>ผลรวมย่อย</span>
                  <span className="font-bold text-gray-800">฿{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>บริการติดตั้ง</span>
                  <span className="font-bold text-gray-800">฿{installationFee}</span>
                </div>
                <div className="flex justify-between">
                  <span>ค่าจัดส่ง</span>
                  <span className="font-bold text-gray-800">฿{shippingFee}</span>
                </div>
              </div>
              
              <div className="border-t pt-4 flex justify-between items-center mb-6">
                 <span className="font-bold text-gray-800">ผลรวมทั้งหมด</span>
                 <span className="font-bold text-[#D65A31] text-xl">฿{total.toLocaleString()}</span>
              </div>

              <button 
                onClick={() => setShowPaymentModal(true)}
                className="w-full bg-[#D65A31] hover:bg-[#b54622] text-white py-3 rounded-lg font-bold shadow-md transition-colors"
              >
                ดำเนินการชำระเงิน
              </button>
              <p className="text-[10px] text-gray-400 text-center mt-2">ชำระเงินปลอดภัย รับประกันคืนเงิน 30 วัน</p>
            </div>

          </div>
        </div>
      </div>

      {/* --- PAYMENT MODAL (POPUP) --- */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden relative flex flex-col md:flex-row">
            
            {/* Close Button */}
            <button onClick={() => setShowPaymentModal(false)} className="absolute top-4 right-4 z-10 p-2 bg-gray-100 rounded-full hover:bg-gray-200">
               <X size={20} />
            </button>

            {/* Left: Scan QR */}
            <div className="flex-1 p-8 bg-gray-50 flex flex-col items-center justify-center border-r border-gray-100">
               <h3 className="text-xl font-bold text-gray-800 mb-6">สแกน QR เพื่อชำระเงิน</h3>
               <div className="bg-[#E0E0E0] w-48 h-48 rounded-lg flex flex-col items-center justify-center mb-6 shadow-inner">
                  <ScanLine size={48} className="text-gray-400 mb-2"/>
                  <span className="text-gray-500 font-bold">QR code</span>
               </div>
               <div className="flex justify-between w-full max-w-xs px-4">
                  <span className="font-bold text-gray-600">ยอดรวม :</span>
                  <span className="font-bold text-xl text-gray-800">฿{total.toLocaleString()}</span>
               </div>
               <p className="text-xs text-gray-400 mt-4 text-center">สแกนด้วยแอปพลิเคชันธนาคารบนมือถือของคุณเพื่อชำระเงิน</p>
            </div>

            {/* Right: Upload Slip */}
            <div className="flex-1 p-8 flex flex-col items-center justify-center">
               <h3 className="text-xl font-bold text-gray-800 mb-6">อัพโหลดสลิปการชำระเงิน</h3>
               <p className="text-xs text-gray-400 mb-6 text-center px-6">
                 หลังจากชำระเงินแล้วโปรดอัพโหลดภาพถ่ายหน้าจอหรือรูปถ่ายหลักฐานการชำระเงินของคุณ
               </p>
               
               {/* Upload Box */}
               <label className="w-full max-w-xs aspect-square border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors mb-6 group">
                  <Upload size={40} className="text-gray-400 group-hover:text-[#D65A31] mb-3 transition-colors"/>
                  <span className="text-sm text-gray-500 font-bold">ลากและวางสลิปของคุณที่นี่</span>
                  <span className="text-xs text-gray-400 mt-1">หรือ</span>
                  <span className="mt-2 bg-gray-200 text-gray-600 text-xs px-3 py-1 rounded group-hover:bg-[#D65A31] group-hover:text-white transition-colors">เรียกดูไฟล์</span>
                  <input type="file" className="hidden" />
               </label>

               <button className="w-full max-w-xs bg-[#D65A31] hover:bg-[#b54622] text-white py-3 rounded-lg font-bold shadow-md">
                 ยืนยันการชำระเงิน
               </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default Cart;