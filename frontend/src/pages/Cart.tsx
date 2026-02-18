import { useState } from 'react';
import { Trash2, Minus, Plus, MapPin, X, ScanLine, Upload, Loader } from 'lucide-react'; 
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import * as api from '../services/api';


const Cart = () => {
  const navigate = useNavigate();
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [slipFile, setSlipFile] = useState<File | null>(null);

  // ดึงข้อมูลจาก Context
  const { cartItems, removeFromCart, updateQuantity, cartTotal, fetchCart } = useCart();
  
  // ค่าส่ง (Mock หรือดึงจาก Backend ถ้า Context เก็บไว้)
  const installationFee = 0; // *ถ้า Context มี summary ให้ดึงมาใช้ได้
  const shippingFee = cartItems.length > 0 ? 150 : 0; 
  const total = cartTotal + installationFee + shippingFee;

  const handleCheckout = async () => {
    if (!slipFile) {
      alert("กรุณาอัปโหลดสลิปการโอนเงิน");
      return;
    }

    try {
      setIsProcessing(true);
      const address = "ที่อยู่จัดส่ง (Default)"; 
      const checkoutRes = await api.checkout(address);
      await api.uploadSlip(checkoutRes.orderId, slipFile);

      alert("สั่งซื้อเรียบร้อย!");
      setShowPaymentModal(false);
      setSlipFile(null);
      await fetchCart();
      navigate('/order-history'); // หรือ /profile
    } catch (error: any) {
      console.error(error);
      alert(error.response?.data?.message || "เกิดข้อผิดพลาดในการสั่งซื้อ");
    } finally {
      setIsProcessing(false);
    }
  };

  // Helper ดึงรูปภาพ
  const getImageUrl = (product: any) => {
      try {
          // เช็คว่า product มีอยู่จริงไหมเพื่อกัน Error
          if (!product) return "https://via.placeholder.com/150";

          let images = product.images;
          if (typeof images === 'string') {
              if (images.startsWith('[')) images = JSON.parse(images);
              else images = [images];
          }
          if (Array.isArray(images) && images.length > 0) {
             const img = images[0];
             return img.startsWith('http') ? img : `http://localhost:3000/uploads/products/${img}`;
          }
      } catch (e) { console.error(e); }
      return "https://via.placeholder.com/150";
  };

  return (
    <div className="bg-gray-50 min-h-screen py-10 font-sans">
      <div className="container mx-auto px-4">
        
        <div className="flex items-center gap-4 mb-6">
           <div className="bg-white px-6 py-2 rounded-lg shadow-sm font-bold text-lg text-gray-800">
             ตะกร้าสินค้า ({cartItems.length})
           </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* --- Items --- */}
          <div className="flex-1 space-y-4">
            {cartItems.length === 0 ? (
               <div className="bg-white p-10 rounded-xl text-center text-gray-500">
                 ไม่มีสินค้าในตะกร้า <br/>
                 <button onClick={() => navigate('/')} className="mt-4 text-[#D65A31] underline">กลับไปเลือกซื้อสินค้า</button>
               </div>
            ) : (
              cartItems.map((item) => (
                // ✅ ตรวจสอบ item และ item.product ก่อนแสดงผล
                item && item.product ? (
                <div key={item.id} className="bg-white p-4 rounded-xl shadow-sm flex flex-col sm:flex-row items-center gap-4 relative">
                  
                  <button 
                    onClick={() => removeFromCart(item.id)}
                    className="absolute top-4 right-4 text-gray-400 hover:text-red-500"
                  >
                    <Trash2 size={18} />
                  </button>

                  {/* Image */}
                  <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                    <img src={getImageUrl(item.product)} alt={item.product.name} className="w-full h-full object-cover" />
                  </div>

                  {/* Info */}
                  <div className="flex-1 text-center sm:text-left">
                    {/* ✅ ใช้ item.product.name */}
                    <h3 className="font-bold text-gray-800">{item.product.name}</h3>
                    <div className="text-gray-500 text-sm">{item.product.description}</div>
                    {/* ✅ ใช้ item.product.price */}
                    <div className="font-bold text-[#D65A31] mt-2">฿{Number(item.product.price).toLocaleString()}</div>
                  </div>

                  {/* Quantity */}
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
                ) : null
              ))
            )}
          </div>

          {/* --- Summary --- */}
          <div className="w-full lg:w-96 space-y-6">
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
                className="w-full bg-[#D65A31] text-white py-3 rounded-lg font-bold hover:bg-[#b54622] disabled:opacity-50"
              >
                ดำเนินการชำระเงิน
              </button>
            </div>
          </div>

        </div>

        {/* Modal Payment (เหมือนเดิม) */}
        {showPaymentModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
             <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl p-8 relative flex flex-col items-center">
                <button onClick={() => setShowPaymentModal(false)} className="absolute top-4 right-4 p-2 bg-gray-100 rounded-full hover:bg-gray-200"><X size={20}/></button>
                <h2 className="text-xl font-bold mb-4">ชำระเงิน</h2>
                <div className="font-bold text-3xl text-[#D65A31] mb-6">฿{total.toLocaleString()}</div>
                
                {/* Upload Section */}
                <label className="border-2 border-dashed border-gray-300 p-8 rounded-xl cursor-pointer hover:bg-gray-50 flex flex-col items-center mb-6 w-full max-w-sm">
                   {slipFile ? (
                      <div className="text-green-600 font-bold">{slipFile.name}</div>
                   ) : (
                      <>
                        <Upload size={40} className="text-gray-400 mb-2"/>
                        <span className="text-gray-500">อัปโหลดสลิป</span>
                      </>
                   )}
                   <input type="file" className="hidden" onChange={(e) => e.target.files && setSlipFile(e.target.files[0])} />
                </label>

                <button onClick={handleCheckout} disabled={!slipFile || isProcessing} className="bg-[#D65A31] text-white px-8 py-3 rounded-lg font-bold disabled:opacity-50">
                   {isProcessing ? "กำลังดำเนินการ..." : "ยืนยัน"}
                </button>
             </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Cart;