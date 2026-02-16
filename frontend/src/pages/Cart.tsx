import { useState } from 'react';
import { Trash2, Minus, Plus, MapPin, X, ScanLine, Upload } from 'lucide-react'; 
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';

const Cart = () => {
  const navigate = useNavigate();
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  // 1. ดึงฟังก์ชันมาจาก Context
  const { cartItems, removeFromCart, updateQuantity, cartTotal } = useCart();
  
  // 2. คำนวณค่าส่ง (แบบง่ายๆ)
  const installationFee = 0; 
  const shippingFee = cartItems.length > 0 ? 150 : 0; 
  const total = cartTotal + installationFee + shippingFee;

  // --- (ลบฟังก์ชัน updateQuantity และ removeItem ของเก่าทิ้งไปเลย ไม่ต้องใช้แล้ว) ---

  return (
    <div className="bg-gray-50 min-h-screen py-10 font-sans">
      <div className="container mx-auto px-4">
        
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
           <div className="bg-white px-6 py-2 rounded-lg shadow-sm font-bold text-lg text-gray-800">
             ตะกร้าสินค้า
           </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* --- LEFT: Cart Items --- */}
          <div className="flex-1 space-y-4">
            {cartItems.length === 0 ? (
               <div className="bg-white p-10 rounded-xl text-center text-gray-500">
                 ไม่มีสินค้าในตะกร้า <br/>
                 <button onClick={() => navigate('/')} className="mt-4 text-[#D65A31] underline">กลับไปเลือกซื้อสินค้า</button>
               </div>
            ) : (
              cartItems.map((item) => (
                <div key={item.id} className="bg-white p-4 rounded-xl shadow-sm flex flex-col sm:flex-row items-center gap-4 relative">
                  
                  {/* ปุ่มลบ: ใช้ removeFromCart จาก Context */}
                  <button 
                    onClick={() => removeFromCart(item.id)}
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
                    {/* ลบ item.detail ออกเพราะใน Context Type ไม่มี field นี้ (หรือถ้าอยากใส่ต้องไปแก้ Type ก่อน) */}
                    <div className="font-bold text-gray-800 mt-2">฿{item.price.toLocaleString()}</div>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center bg-gray-100 rounded-lg p-1 gap-2">
                     <button 
                       onClick={() => updateQuantity(item.id, item.quantity - 1)} 
                       className="p-2 hover:bg-white rounded shadow-sm disabled:opacity-50"
                       disabled={item.quantity <= 1}
                     >
                       <Minus size={14}/>
                     </button>
                     <span className="mx-2 text-sm font-bold w-4 text-center">{item.quantity}</span>
                     <button 
                       onClick={() => updateQuantity(item.id, item.quantity + 1)} 
                       className="p-2 hover:bg-white rounded shadow-sm"
                     >
                       <Plus size={14}/>
                     </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* --- RIGHT: Order Summary --- */}
          <div className="w-full lg:w-96 space-y-6">
            
            {/* Address (Mock) */}
            <div className="bg-white p-5 rounded-xl shadow-sm">
               <div className="flex justify-between items-center mb-3">
                 <h3 className="font-bold text-gray-800">ที่อยู่จัดส่ง</h3>
                 <button className="text-blue-500 text-xs">แก้ไข</button>
               </div>
               <div className="bg-[#EBF1F5] p-4 rounded-lg text-xs text-gray-600 leading-relaxed flex gap-3">
                  <MapPin size={24} className="text-gray-400 flex-shrink-0 mt-1" />
                  <div>
                    <span className="font-bold text-gray-800 block mb-1">คุณลูกค้า (ตัวอย่าง)</span>
                    123 ถนนตัวอย่าง ต.ในเมือง <br/>
                    อ.เมือง จ.เชียงใหม่ 50200
                  </div>
               </div>
            </div>

            {/* Price Summary */}
            <div className="bg-white p-6 rounded-xl shadow-sm sticky top-4">
              <h3 className="font-bold text-lg mb-4">สรุปคำสั่งซื้อ</h3>
              
              <div className="space-y-3 mb-6 pb-6 border-b border-gray-100 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>ยอดรวมสินค้า</span>
                  <span>฿{cartTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>ค่าจัดส่ง</span>
                  <span>฿{shippingFee}</span>
                </div>
              </div>

              <div className="flex justify-between font-bold text-lg mb-6 text-gray-800">
                <span>ยอดรวมทั้งหมด</span>
                <span className="text-[#D65A31]">฿{total.toLocaleString()}</span>
              </div>

              <button 
                onClick={() => setShowPaymentModal(true)}
                disabled={cartItems.length === 0}
                className="w-full bg-[#D65A31] text-white py-3 rounded-lg font-bold hover:bg-[#b54622] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ดำเนินการชำระเงิน
              </button>
            </div>
          </div>

        </div>

        {/* --- PAYMENT MODAL --- */}
        {showPaymentModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden relative flex flex-col md:flex-row">
              
              <button onClick={() => setShowPaymentModal(false)} className="absolute top-4 right-4 z-10 p-2 bg-gray-100 rounded-full hover:bg-gray-200">
                 <X size={20} />
              </button>

              <div className="flex-1 p-8 bg-gray-50 flex flex-col items-center justify-center border-r border-gray-100">
                 <h3 className="text-xl font-bold text-gray-800 mb-6">สแกน QR เพื่อชำระเงิน</h3>
                 <div className="bg-[#E0E0E0] w-48 h-48 rounded-lg flex flex-col items-center justify-center mb-6 shadow-inner">
                    <ScanLine size={48} className="text-gray-400 mb-2"/>
                    <span className="text-gray-500 font-bold">QR Code</span>
                 </div>
                 <div className="font-bold text-xl text-gray-800">฿{total.toLocaleString()}</div>
              </div>

              <div className="flex-1 p-8 flex flex-col items-center justify-center">
                 <h3 className="text-xl font-bold text-gray-800 mb-6">อัพโหลดสลิป</h3>
                 <label className="w-full max-w-xs aspect-square border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors mb-6">
                    <Upload size={40} className="text-gray-400 mb-3"/>
                    <span className="text-sm text-gray-500">คลิกเพื่ออัพโหลดสลิป</span>
                    <input type="file" className="hidden" />
                 </label>
                 <button className="w-full max-w-xs bg-[#D65A31] text-white py-3 rounded-lg font-bold">ยืนยันการชำระเงิน</button>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Cart;