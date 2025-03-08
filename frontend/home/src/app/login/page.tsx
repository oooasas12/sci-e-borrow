"use client";
import Image from "next/image";
import Layout from "@/Layouts/default"
import { useState } from "react";
import ButtonPrimary from "@/components/button/buttonPrimary";
import { FaUser } from "react-icons/fa6";
import { FiLogIn } from "react-icons/fi";
import { useRouter } from "next/navigation";
import toast, { Toaster } from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { setBranch, setPositionBranch, setPositionFac, setEquipmentGroup, setEquipmentStatus, setApprovalStatus, setEquipmentName, setUnit, setBudgetSource } from '@/store/features/masterDataSlice';
import { setUser } from '@/store/features/authSlice';
import Cookies from 'js-cookie';
import { v4 as uuidv4 } from 'uuid';

// ฟังก์ชันสำหรับเก็บข้อมูลใน cookies
const setAuthCookies = (userData: any, token: string) => {
  // กำหนดวันหมดอายุเป็น 7 วัน
  const expiresIn = 1;
  
  // เก็บ token
  Cookies.set('auth_token', token, { 
    expires: expiresIn,
    secure: true,
    sameSite: 'strict'
  });
  
  // เก็บข้อมูลผู้ใช้
  Cookies.set('user_data', JSON.stringify(userData), {
    expires: expiresIn,
    secure: true,
    sameSite: 'strict'
  });
  
  // สร้าง session ID
  Cookies.set('session_id', uuidv4(), {
    expires: expiresIn,
    secure: true,
    sameSite: 'strict'
  });
};

export default function Login() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [errorLogin, setErrorLogin] = useState(false)

  const handleClick = async () => {
    if (username && password) {
      try {
        // แสดง loading
        const formData = new FormData();
        formData.append('username', username);
        formData.append('password', password);

        // ส่งข้อมูลแบบ form-data
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/login`, {
          method: 'POST',
          body: formData,
          credentials: 'include',
          mode: 'cors'
        });

        // ดึงข้อมูล response
        const result = await response.json();

        // if (!response.ok) {
        //   throw new Error(result.message || 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ');
        // }

        if (result.status === 'login success' && result.data) {
          // เก็บข้อมูลใน cookies ก่อน
          const token = result.token;
          if (!token) {
            throw new Error('ไม่พบ token ในข้อมูลที่ได้รับ');
          }
          setAuthCookies(result.data, token);

          // เก็บข้อมูลใน Redux
          dispatch(setUser(result.data));

          toast.success('เข้าสู่ระบบสำเร็จ', {
            duration: 3000
          });
          
          // รอให้ cookies และ redux ถูกเซ็ตเรียบร้อยก่อน
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // ใช้ router.push แทน window.location
          if (result.data.position_branch.id == 5) {
            router.push('/admin/equipment-bow');
          } else if (result.data.position_branch.id == 2) {
            router.push('/approval/equipment-bow');
          } else {
            router.push('/user/equipment-bow');
          }
        } else {
          throw new Error(result.message || 'ข้อมูลผู้ใช้ไม่ถูกต้อง');
        }
      } catch (error) {
        // ปิด loading และแสดง error
        toast.dismiss('login');
        console.error('Login error:', error);
        
        let errorMessage = 'เกิดข้อผิดพลาดในการเชื่อมต่อ กรุณาลองใหม่อีกครั้ง';
        if (error instanceof Error) {
          errorMessage = error.message;
        }
        
        toast.error(errorMessage, {
          duration: 3000
        });
        setErrorLogin(true);
      }
    } else {
      toast.error('กรุณากรอกข้อมูลให้ครบถ้วน', {
        duration: 3000
      });
    }
  }

  return (
    <div className="bg-primary_1 min-h-screen overflow-hidden">
      <Toaster
        position="bottom-right"
        reverseOrder={false}
      />
      <div className="h-screen w-full overflow-auto">
        <div className="mx-auto flex items-center h-full md:px-[40px] lg:w-[920px] ">
          <div className="container mx-auto h-full md:h-fit">
            <div className="flex bg-bg_1 rounded-lg h-full md:h-fit lg:min-h-[400px]">
              <div className="w-1/3 hidden lg:block">
                <img src="/images/600x400.png" className=" rounded-l-lg h-full object-cover" alt="" />
              </div>
              <div className="w-full lg:w-2/3 ">
                <form action={handleClick} className="flex gap-8 flex-col p-8 h-full justify-center">
                  <div className="flex gap-4 items-center">
                    <img src="/images/logo-sci.png" className=" size-[80px] " alt="" />
                    <span className="md:text-xl text-font_color">ระบบยืม-คืนครุภัณฑ์ <br /> คณะวิทยาศาตร์และเทคโนโลยี</span>
                  </div>
                  <div className="flex flex-col gap-2 ">
                    <span className="text-sm text-font_color">Username</span>
                    <input type="text" onChange={event => setUsername(event.target.value)} className=" rounded-lg border-black border hover:bg-gray-50 px-2 h-10 focus:outline-primary_1" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <span className="text-sm text-font_color">Password</span>
                    <input type="password" onChange={event => setPassword(event.target.value)} className=" rounded-lg border-black border hover:bg-gray-50 px-2 h-10 focus:outline-primary_1" />
                    <span className="text-xs text-red-500">{errorLogin ? "Username หรือ Password ไม่ถูกต้อง" : ""}</span>
                  </div>
                  <ButtonPrimary type="submit" data="เข้าสู่ระบบ" size="medium" className="ml-auto" icon={<FiLogIn />} />
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
