// import { useState,type ChangeEvent,type FormEvent } from 'react';
// import { registerUser } from '../services/api';
// import { useNavigate, Link } from 'react-router-dom';

// const Register = () => {
//   const navigate = useNavigate();
  
//   // เพิ่ม state confirmPassword
//   const [formData, setFormData] = useState({
//     username: '',
//     password: '',
//     confirmPassword: '', // ✅ เพิ่มช่องนี้
//     email: '',
//     phone: '',
//     address: ''
//   });
  
//   const [error, setError] = useState('');
//   const [isLoading, setIsLoading] = useState(false);

//   const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value
//     });
//   };

//   const handleSubmit = async (e: FormEvent) => {
//     e.preventDefault();
//     setError('');

//     // ✅ ตรวจสอบว่ารหัสผ่านตรงกันหรือไม่
//     if (formData.password !== formData.confirmPassword) {
//       setError("รหัสผ่านและการยืนยันรหัสผ่านไม่ตรงกัน");
//       return;
//     }

//     setIsLoading(true);

//     try {
//       // ✅ ตัด confirmPassword ออกก่อนส่งไป Backend (เพราะ DTO ไม่ได้รับค่านี้)
//       const { confirmPassword, ...dataToSend } = formData;
      
//       await registerUser(dataToSend);
      
//       alert("สมัครสมาชิกสำเร็จ! กรุณาเข้าสู่ระบบ");
//       navigate('/login');
      
//     } catch (err: any) {
//       console.error("Registration Error:", err);
//       let errorMessage = "เกิดข้อผิดพลาดในการสมัครสมาชิก กรุณาลองใหม่อีกครั้ง";
      
//       if (err.response && err.response.data) {
//          const msg = err.response.data.message;
//          errorMessage = Array.isArray(msg) ? msg[0] : msg;
//       }
      
//       setError(errorMessage);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-md">
//         <div>
//           <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
//             สมัครสมาชิกใหม่
//           </h2>
//           <p className="mt-2 text-center text-sm text-gray-600">
//             หรือ{' '}
//             <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
//               เข้าสู่ระบบบัญชีที่มีอยู่
//             </Link>
//           </p>
//         </div>

//         {error && (
//           <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
//             <div className="flex">
//               <div className="flex-shrink-0">
//                 <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
//                   <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
//                 </svg>
//               </div>
//               <div className="ml-3">
//                 <p className="text-sm text-red-700">{error}</p>
//               </div>
//             </div>
//           </div>
//         )}

//         <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
//           <div className="rounded-md shadow-sm space-y-4">
//             {/* Username */}
//             <div>
//               <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
//                 ชื่อผู้ใช้ <span className="text-red-500">*</span>
//               </label>
//               <input
//                 id="username"
//                 name="username"
//                 type="text"
//                 required
//                 minLength={3}
//                 maxLength={50}
//                 className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
//                 placeholder="Username"
//                 value={formData.username}
//                 onChange={handleChange}
//               />
//             </div>

//             {/* Email */}
//             <div>
//               <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
//                 อีเมล <span className="text-red-500">*</span>
//               </label>
//               <input
//                 id="email"
//                 name="email"
//                 type="email"
//                 required
//                 maxLength={100}
//                 className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
//                 placeholder="example@mail.com"
//                 value={formData.email}
//                 onChange={handleChange}
//               />
//             </div>

//             {/* Password */}
//             <div>
//               <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
//                 รหัสผ่าน <span className="text-red-500">*</span>
//               </label>
//               <input
//                 id="password"
//                 name="password"
//                 type="password"
//                 required
//                 minLength={6}
//                 maxLength={100}
//                 className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
//                 placeholder="รหัสผ่าน (ขั้นต่ำ 6 ตัวอักษร)"
//                 value={formData.password}
//                 onChange={handleChange}
//               />
//             </div>

//             {/* ✅ Confirm Password */}
//             <div>
//               <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
//                 ยืนยันรหัสผ่าน <span className="text-red-500">*</span>
//               </label>
//               <input
//                 id="confirmPassword"
//                 name="confirmPassword"
//                 type="password"
//                 required
//                 minLength={6}
//                 maxLength={100}
//                 className={`appearance-none rounded-md relative block w-full px-3 py-2 border placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm ${
//                   formData.confirmPassword && formData.password !== formData.confirmPassword 
//                     ? 'border-red-500 focus:ring-red-500 focus:border-red-500' // สีแดงถ้าไม่ตรง
//                     : 'border-gray-300'
//                 }`}
//                 placeholder="กรอกรหัสผ่านอีกครั้ง"
//                 value={formData.confirmPassword}
//                 onChange={handleChange}
//               />
//                {/* แสดงข้อความเตือนทันทีที่พิมพ์ไม่ตรง */}
//                {formData.confirmPassword && formData.password !== formData.confirmPassword && (
//                 <p className="text-xs text-red-500 mt-1">รหัสผ่านไม่ตรงกัน</p>
//               )}
//             </div>

//             {/* Phone */}
//             <div>
//               <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
//                 เบอร์โทรศัพท์ (ถ้ามี)
//               </label>
//               <input
//                 id="phone"
//                 name="phone"
//                 type="tel"
//                 maxLength={15}
//                 className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
//                 placeholder="08xxxxxxxx"
//                 value={formData.phone}
//                 onChange={handleChange}
//               />
//             </div>

//             {/* Address */}
//             <div>
//               <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
//                 ที่อยู่ (ถ้ามี)
//               </label>
//               <textarea
//                 id="address"
//                 name="address"
//                 rows={3}
//                 maxLength={255}
//                 className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
//                 placeholder="ที่อยู่สำหรับจัดส่ง..."
//                 value={formData.address}
//                 onChange={handleChange}
//               />
//             </div>
//           </div>

//           <div>
//             <button
//               type="submit"
//               disabled={isLoading}
//               className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${
//                 isLoading
//                   ? 'bg-gray-400 cursor-not-allowed'
//                   : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
//               }`}
//             >
//               {isLoading ? 'กำลังบันทึก...' : 'สมัครสมาชิก'}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default Register;

import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({ email: '', username: '', password: '', confirmPassword: '' });
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await register(formData);
      alert('สมัครสมาชิกสำเร็จ!');
      navigate('/login');
    } catch (err) {
      alert('Error');
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* ฝั่งซ้าย: รูปภาพและข้อความ */}
      <div className="hidden lg:flex lg:w-3/4 relative">
        <img 
          src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80&w=1974" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/30 flex flex-col justify-center px-20">
          <h1 className="text-white text-4xl font-bold leading-tight max-w-2xl">
            "ยกระดับประสบการณ์การใช้ชีวิตของคุณ"
          </h1>
          <p className="text-gray-200 mt-4">homealright.com</p>
        </div>
      </div>

      {/* ฝั่งขวา: ฟอร์ม */}
      <div className="w-full lg:w-1/4 bg-[#99C4C8] flex items-center justify-center p-8">
        <div className="bg-white rounded-[2rem] p-8 w-full max-w-sm shadow-xl flex flex-col items-center">
          <div className="w-20 h-20 border-2 border-[#99C4C8] rounded-full flex items-center justify-center mb-4 text-[#99C4C8] text-4xl">🏠</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-6">ลงทะเบียน</h2>

          <form onSubmit={handleSubmit} className="w-full space-y-3">
            <input type="email" placeholder="อีเมล" className="w-full p-3 bg-gray-50 border rounded-full outline-none" onChange={(e) => setFormData({...formData, email: e.target.value})} />
            <input type="text" placeholder="ชื่อผู้ใช้" className="w-full p-3 bg-gray-50 border rounded-full outline-none" onChange={(e) => setFormData({...formData, username: e.target.value})} />
            <input type="password" placeholder="รหัสผ่าน" className="w-full p-3 bg-gray-50 border rounded-full outline-none" onChange={(e) => setFormData({...formData, password: e.target.value})} />
            <input type="password" placeholder="ยืนยันรหัสผ่าน" className="w-full p-3 bg-gray-50 border rounded-full outline-none" onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})} />
            
            <button type="submit" className="w-full bg-[#D65A31] text-white py-3 rounded-full font-bold mt-4">
              ลงทะเบียน
            </button>
          </form>

          <p className="mt-6 text-xs text-gray-500">มีบัญชีผู้ใช้แล้ว? <Link to="/login" className="text-blue-500 font-bold underline">ลงชื่อเข้าใช้</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Register;