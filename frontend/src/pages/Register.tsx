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

import { User, Lock, Mail, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex min-h-screen bg-white">
      
      {/* --- LEFT: Image Section (Same as Login) --- */}
      <div className="hidden lg:flex w-[65%] relative bg-gray-900">
        <img 
          src="https://images.unsplash.com/photo-1616486338812-3dadae4b4f9d?auto=format&fit=crop&w=1200&q=80" 
          alt="Living Room" 
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 flex flex-col justify-end p-16 text-white pb-24">
           <h2 className="text-4xl font-bold leading-tight mb-4 drop-shadow-lg">
             "ยกระดับประสบการณ์การใช้ชีวิตของคุณ"
           </h2>
           <div className="flex items-center gap-2 mt-4 text-sm opacity-80">
              <span className="w-8 h-8 border-2 border-white rounded flex items-center justify-center font-bold">H</span>
              homealright.com
           </div>
        </div>
      </div>

      {/* --- RIGHT: Form Section --- */}
      <div className="w-full lg:w-[35%] bg-[#91B5B3] flex items-center justify-center p-8">
        <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md text-center">
          
          <div className="mb-6 flex flex-col items-center">
             <div className="w-14 h-14 bg-blue-50 text-[#148F96] rounded-full flex items-center justify-center mb-3 border-2 border-[#148F96]">
               <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
             </div>
             <h2 className="text-2xl font-bold text-gray-800">ลงทะเบียน</h2>
          </div>

          <form className="space-y-4">
            
            {/* Email */}
            <div className="relative">
              <input type="email" placeholder="อีเมล" className="w-full pl-5 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-[#148F96] text-xs" />
              <Mail size={16} className="absolute right-4 top-3.5 text-gray-400" />
            </div>

            {/* Username */}
            <div className="relative">
              <input type="text" placeholder="ชื่อผู้ใช้" className="w-full pl-5 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-[#148F96] text-xs" />
              <User size={16} className="absolute right-4 top-3.5 text-gray-400" />
            </div>

            {/* Password */}
            <div className="relative">
              <input type={showPassword ? "text" : "password"} placeholder="รหัสผ่าน" className="w-full pl-5 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-[#148F96] text-xs" />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-3.5 text-gray-400 hover:text-gray-600">
                {showPassword ? <EyeOff size={16}/> : <Eye size={16}/>}
              </button>
            </div>

             {/* Confirm Password */}
             <div className="relative">
              <input type="password" placeholder="ยืนยันรหัสผ่าน" className="w-full pl-5 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-[#148F96] text-xs" />
              <Lock size={16} className="absolute right-4 top-3.5 text-gray-400" />
            </div>

            {/* Terms Checkbox */}
            <div className="flex items-start gap-2 text-[10px] text-gray-500 text-left px-2 mt-2">
               <input type="checkbox" className="mt-0.5 rounded border-gray-300 text-[#148F96] focus:ring-[#148F96]" />
               <span>ฉันยอมรับ <a href="#" className="text-[#148F96] hover:underline">นโยบายความเป็นส่วนตัว</a> และ <a href="#" className="text-[#148F96] hover:underline">ข้อตกลงการใช้งาน</a></span>
            </div>

            <button className="w-full bg-[#D65A31] hover:bg-[#b54622] text-white py-3 rounded-full font-bold shadow-lg mt-4 transition-transform active:scale-95">
              ลงทะเบียน
            </button>

          </form>

          <p className="mt-6 text-xs text-gray-400">
            มีบัญชีผู้ใช้แล้ว? <Link to="/login" className="text-[#148F96] font-bold hover:underline">ลงชื่อเข้าใช้</Link>
          </p>

        </div>
      </div>
    </div>
  );
};

export default Register;