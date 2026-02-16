// import { useState,type ChangeEvent,type FormEvent } from 'react';
// import { useAuth } from '../contexts/AuthContext'; // เรียกใช้ AuthContext //
// import { useNavigate, Link } from 'react-router-dom';

// const Login = () => {
//   const { login } = useAuth();
//   const navigate = useNavigate();

//   // State สำหรับเก็บข้อมูล Form
//   const [formData, setFormData] = useState({
//     username: '',
//     password: ''
//   });

//   const [error, setError] = useState('');
//   const [isLoading, setIsLoading] = useState(false);

//   // ฟังก์ชันอัปเดตค่าใน State เมื่อพิมพ์
//   const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value
//     });
//   };

//   // ฟังก์ชันเมื่อกดปุ่ม Login
//   const handleSubmit = async (e: FormEvent) => {
//     e.preventDefault();
//     setError('');
//     setIsLoading(true);

//     try {
//       // เรียกใช้ฟังก์ชัน login จาก Context
//       await login(formData);
      
//       // ถ้า Login สำเร็จ ให้ไปหน้า Home
//       navigate('/home'); 
      
//     } catch (err: any) {
//       console.error("Login Error:", err);
//       // แสดงข้อความ Error (ถ้า Backend ส่งมา) หรือข้อความทั่วไป
//       // เช็คว่า response มี message หรือไม่ (ขึ้นอยู่กับ NestJS Exception Filter)
//       let errorMessage = "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง";
      
//       if (err.response && err.response.data && err.response.data.message) {
//          errorMessage = typeof err.response.data.message === 'string' 
//             ? err.response.data.message 
//             : errorMessage;
//       }
      
//       setError(errorMessage);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-md">
        
//         {/* Header ส่วนหัว */}
//         <div>
//           <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
//             เข้าสู่ระบบ
//           </h2>
//           <p className="mt-2 text-center text-sm text-gray-600">
//             ยังไม่มีบัญชีใช่ไหม?{' '}
//             <Link to="/register" className="font-medium text-blue-600 hover:text-blue-500">
//               สมัครสมาชิกใหม่
//             </Link>
//           </p>
//         </div>

//         {/* Error Alert Box */}
//         {error && (
//           <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4" role="alert">
//             <div className="flex">
//               <div className="flex-shrink-0">
//                 {/* Error Icon */}
//                 <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
//                   <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
//                 </svg>
//               </div>
//               <div className="ml-3">
//                 <p className="text-sm text-red-700 font-medium">{error}</p>
//               </div>
//             </div>
//           </div>
//         )}

//         <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
//           <div className="rounded-md shadow-sm space-y-4">
            
//             {/* Username Input */}
//             <div>
//               <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
//                 ชื่อผู้ใช้
//               </label>
//               <input
//                 id="username"
//                 name="username"
//                 type="text"
//                 required
//                 className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
//                 placeholder="กรอกชื่อผู้ใช้ของคุณ"
//                 value={formData.username}
//                 onChange={handleChange}
//               />
//             </div>

//             {/* Password Input */}
//             <div>
//               <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
//                 รหัสผ่าน
//               </label>
//               <input
//                 id="password"
//                 name="password"
//                 type="password"
//                 required
//                 className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
//                 placeholder="กรอกรหัสผ่าน"
//                 value={formData.password}
//                 onChange={handleChange}
//               />
//             </div>
//           </div>

//           {/* ปุ่ม Submit */}
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
//               {isLoading ? (
//                 <>
//                   <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                     <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                     <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                   </svg>
//                   กำลังเข้าสู่ระบบ...
//                 </>
//               ) : (
//                 'เข้าสู่ระบบ'
//               )}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default Login;

import { User, Lock, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex min-h-screen bg-white">
      
      {/* --- LEFT: Image Section (65%) --- */}
      <div className="hidden lg:flex w-[65%] relative bg-gray-900">
        <img 
          src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80" 
          alt="Living Room" 
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 flex flex-col justify-end p-16 text-white pb-24">
           <h2 className="text-4xl font-bold leading-tight mb-4 drop-shadow-lg">
             "สร้างพื้นที่ส่วนตัวที่สมบูรณ์แบบของคุณ <br/>
             ทุกสิ่งที่คุณต้องการเพื่อเปลี่ยนบ้านให้เป็นที่อยู่อาศัยที่อบอุ่น"
           </h2>
           <div className="flex items-center gap-2 mt-4 text-sm opacity-80">
              <span className="w-8 h-8 border-2 border-white rounded flex items-center justify-center font-bold">H</span>
              homealright.com
           </div>
        </div>
      </div>

      {/* --- RIGHT: Form Section (35%) --- */}
      <div className="w-full lg:w-[35%] bg-[#91B5B3] flex items-center justify-center p-8">
        <div className="bg-white rounded-3xl shadow-2xl p-10 w-full max-w-md text-center">
          
          {/* Logo & Header */}
          <div className="mb-8 flex flex-col items-center">
             <div className="w-16 h-16 bg-blue-50 text-[#148F96] rounded-full flex items-center justify-center mb-4 border-2 border-[#148F96]">
               <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
             </div>
             <h2 className="text-2xl font-bold text-gray-800">ลงชื่อเข้าใช้</h2>
          </div>

          {/* Form */}
          <form className="space-y-5">
            
            {/* Username Input */}
            <div className="relative">
              <input 
                type="text" 
                placeholder="ชื่อผู้ใช้" 
                className="w-full pl-5 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-[#148F96] text-sm"
              />
              <User size={18} className="absolute right-4 top-3.5 text-gray-400" />
            </div>

            {/* Password Input */}
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"} 
                placeholder="รหัสผ่าน" 
                className="w-full pl-5 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-[#148F96] text-sm"
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-3.5 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff size={18}/> : <Eye size={18}/>}
              </button>
            </div>

            {/* Options */}
            <div className="flex items-center justify-between text-xs text-gray-500 px-2">
               <label className="flex items-center gap-2 cursor-pointer">
                 <input type="checkbox" className="rounded border-gray-300 text-[#148F96] focus:ring-[#148F96]" />
                 จดจำฉัน
               </label>
               <a href="#" className="hover:text-[#148F96]">ลืมรหัสผ่าน?</a>
            </div>

            {/* Submit Button */}
            <button className="w-full bg-[#D65A31] hover:bg-[#b54622] text-white py-3 rounded-full font-bold shadow-lg transition-transform active:scale-95">
              ลงชื่อเข้าใช้
            </button>

          </form>

          {/* Footer */}
          <p className="mt-8 text-xs text-gray-400">
            ยังไม่มีบัญชีใช่ไหม? <Link to="/register" className="text-[#148F96] font-bold hover:underline">ลงทะเบียน</Link>
          </p>

        </div>
      </div>
    </div>
  );
};

export default Login;