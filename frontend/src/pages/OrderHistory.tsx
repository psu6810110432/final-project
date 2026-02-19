import { useState, useEffect } from 'react';
import * as api from '../services/api';
import { Package, Calendar, ChevronRight, Clock, CheckCircle, XCircle, MapPin } from 'lucide-react';

// กำหนด Interface สำหรับข้อมูล Order ตามโครงสร้างทั่วไปของ NestJS
interface OrderItem {
  id: string;
  product: api.Product;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  createdAt: string;
  totalPrice: number | string;
  status: 'pending' | 'completed' | 'cancelled' | 'shipped';
  address: string;
  orderItems: OrderItem[];
}

const OrderHistory = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await api.getMyOrders(); // เรียกใช้จาก api.ts
        setOrders(data);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  // ฟังก์ชันจัดการสีของสถานะ
  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'completed': return { color: 'text-green-600', bg: 'bg-green-50', icon: <CheckCircle size={16} />, label: 'สำเร็จ' };
      case 'cancelled': return { color: 'text-red-600', bg: 'bg-red-50', icon: <XCircle size={16} />, label: 'ยกเลิก' };
      case 'shipped': return { color: 'text-blue-600', bg: 'bg-blue-50', icon: <Package size={16} />, label: 'ส่งแล้ว' };
      default: return { color: 'text-amber-600', bg: 'bg-amber-50', icon: <Clock size={16} />, label: 'รอตรวจสอบ' };
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center text-gray-500">กำลังโหลดประวัติการสั่งซื้อ...</div>;

  return (
    <div className="bg-[#F9FAFB] min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-3xl">
        <h1 className="text-2xl font-bold text-gray-800 mb-8 flex items-center gap-2">
          <Package className="text-[#148F96]" /> ประวัติการสั่งซื้อ
        </h1>

        {orders.length === 0 ? (
          <div className="bg-white p-20 rounded-3xl text-center shadow-sm border border-dashed">
            <p className="text-gray-400">ยังไม่มีประวัติการสั่งซื้อ</p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const status = getStatusInfo(order.status);
              return (
                <div key={order.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:border-[#148F96] transition-all group">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <span className="text-xs font-mono text-gray-400 uppercase tracking-wider">#{order.id.slice(-8)}</span>
                      <div className="flex items-center gap-2 text-gray-600 mt-1">
                        <Calendar size={14} />
                        <span className="text-sm">{new Date(order.createdAt).toLocaleDateString('th-TH')}</span>
                      </div>
                    </div>
                    <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${status.bg} ${status.color}`}>
                      {status.icon} {status.label}
                    </div>
                  </div>

                  <div className="flex items-center gap-4 mb-4 text-gray-500">
                     <MapPin size={14} className="flex-shrink-0" />
                     <p className="text-sm truncate">{order.address || 'ไม่มีที่อยู่จัดส่ง'}</p>
                  </div>

                  <div className="pt-4 border-t border-gray-50 flex justify-between items-center">
                    <div>
                      <p className="text-xs text-gray-400">ราคาสุทธิ</p>
                      <p className="text-lg font-bold text-[#D65A31]">฿{Number(order.totalPrice).toLocaleString()}</p>
                    </div>
                    <button className="flex items-center gap-1 text-sm font-bold text-[#148F96] group-hover:gap-2 transition-all">
                      รายละเอียด <ChevronRight size={18} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderHistory;