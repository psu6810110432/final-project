import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

// 1. ปรับ Interface ให้ตรงกับ User Entity ใน Backend ของคุณ
interface UserProfile {
  id: string;
  username: string;
  email: string;
  phone?: string;
  address?: string;
  role: string;
  userImage?: string;
}

const Profile: React.FC = () => {
  const { user } = useAuth(); // ดึงข้อมูล user เบื้องต้นจาก Context
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        // ดึงข้อมูล Profile ฉบับเต็มจาก Database ผ่าน API
        const response = await api.get('/auth/profile'); 
        setProfile(response.data);
      } catch (error) {
        console.error('Failed to fetch profile:', error);
        // ถ้าดึงข้อมูลใหม่ไม่สำเร็จ ให้ใช้ข้อมูลจาก Context เท่าที่มีไปก่อนเพื่อป้องกันหน้าขาว
        if (user) {
          setProfile(user as any);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfileData();
  }, [user]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex justify-center items-center min-h-[60vh] text-gray-500 text-lg">
        ไม่พบข้อมูลผู้ใช้งาน กรุณาเข้าสู่ระบบใหม่อีกครั้ง
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">บัญชีของฉัน</h1>
      
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        {/* ส่วนหัวแสดงรูปโปรไฟล์ */}
        <div className="h-32 bg-gradient-to-r from-blue-500 to-indigo-600"></div>
        
        <div className="px-8 pb-8">
          <div className="relative flex justify-between items-end -mt-16 mb-8">
            <div className="flex items-end space-x-6">
              <div className="w-32 h-32 bg-white rounded-full p-1 shadow-md overflow-hidden">
                {profile.userImage ? (
                  <img src={profile.userImage} alt="Profile" className="w-full h-full object-cover rounded-full" />
                ) : (
                  <div className="w-full h-full bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center text-5xl font-bold uppercase">
                    {profile.username.charAt(0)}
                  </div>
                )}
              </div>
              <div className="pb-2">
                <h2 className="text-2xl font-bold text-gray-800">{profile.username}</h2>
                <p className="text-gray-500 mt-1 uppercase text-sm font-semibold tracking-wider">
                  Status: {profile.role}
                </p>
              </div>
            </div>
            <button className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors shadow-sm">
              แก้ไขโปรไฟล์
            </button>
          </div>

          <hr className="mb-8 border-gray-100" />

          {/* ข้อมูลที่ดึงมาจาก Database */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-500">ชื่อผู้ใช้ (Username)</label>
              <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-800">
                {profile.username}
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-500">อีเมล (Email)</label>
              <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-800">
                {profile.email || 'ไม่ได้ระบุ'}
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-500">เบอร์โทรศัพท์</label>
              <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-800">
                {profile.phone || 'ยังไม่ได้ระบุข้อมูล'}
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-500">ตำแหน่ง (Role)</label>
              <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-800 uppercase">
                {profile.role}
              </div>
            </div>

            <div className="space-y-1 md:col-span-2">
              <label className="text-sm font-medium text-gray-500">ที่อยู่ปัจจุบัน</label>
              <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-800 min-h-[80px]">
                {profile.address || 'ยังไม่ได้ระบุที่อยู่สำหรับจัดส่ง'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;