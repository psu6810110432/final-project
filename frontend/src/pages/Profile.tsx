import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
// 1. นำเข้า getProfile จาก api.ts ที่มีการตั้งค่า Endpoint ถูกต้องแล้ว
import { getProfile } from '../services/api';

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
        // 2. เรียกใช้ฟังก์ชันดึงข้อมูลโปรไฟล์ ซึ่งจะยิงไปที่ /users/profile/me
        const data = await getProfile(); 
        setProfile(data);
      } catch (error) {
        console.error('Failed to fetch profile:', error);
        // ถ้าดึงข้อมูลใหม่ไม่สำเร็จ ให้ใช้ข้อมูลจาก Context มาแปลงให้ตรง Type ป้องกันหน้าขาว
        if (user) {
          setProfile({
            id: user.id || '',
            username: user.username || 'Unknown',
            email: '', 
            role: user.role || 'user',
          } as UserProfile);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfileData();
  }, [user?.id]); // ใช้ user?.id เพื่อป้องกันการยิง API รัวๆ ถ้าระบบ context อัปเดตบ่อย

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#148F96]"></div>
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
        {/* ส่วนหัวแสดงรูปโปรไฟล์ ไล่สี #148F96 */}
        <div className="h-32 bg-gradient-to-r from-[#148F96] to-[#107378]"></div>
        
        <div className="px-8 pb-8">
          <div className="relative flex justify-between items-end -mt-16 mb-8">
            <div className="flex items-end space-x-6">
              <div className="w-32 h-32 bg-white rounded-full p-1 shadow-md overflow-hidden">
                {profile.userImage ? (
                  <img 
                    src={profile.userImage} 
                    alt="Profile" 
                    className="w-full h-full object-cover rounded-full" 
                    // ป้องกันภาพแตกกรณี URL มีปัญหา
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                ) : (
                  <div className="w-full h-full bg-[#148F96]/10 text-[#148F96] rounded-full flex items-center justify-center text-5xl font-bold uppercase">
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
            <button className="px-6 py-2 bg-[#148F96] hover:bg-[#107378] text-white rounded-lg font-medium transition-colors shadow-sm">
              แก้ไขโปรไฟล์
            </button>
          </div>

          <hr className="mb-8 border-gray-100" />

          {/* ข้อมูลที่ดึงมาจาก Database */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-500">ชื่อผู้ใช้</label>
              <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-800">
                {profile.username}
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-500">อีเมล</label>
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
              <label className="text-sm font-medium text-gray-500">ตำแหน่ง</label>
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