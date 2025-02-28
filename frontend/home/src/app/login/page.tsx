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

export default function Login() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [errorLogin, setErrorLogin] = useState(false)

  const handleClick = async () => {
    if (username && password) {
      try {
        const formData = new FormData();
        formData.append('username', username);
        formData.append('password', password);

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/login`, {
          method: 'POST',
          body: formData
        });
  
        if (response.ok) {
          const userData = await response.json();
          
          // ตรวจสอบว่าข้อมูลผู้ใช้มีอยู่ก่อนที่จะเก็บลง Redux
          if (userData && userData.data) {
            dispatch(setUser(userData.data));
            toast.success('กำลังเข้าสู่ระบบ', {
              duration: 3000
            });
            setTimeout(() => {
              router.push('/equipment-bow');
            }, 3000);
          } else {
            throw new Error('ข้อมูลผู้ใช้ไม่ถูกต้อง');
          }
        } else {
          toast.error('Username หรือ Password ไม่ถูกต้อง', {
            duration: 3000
          });
          setErrorLogin(true);
        }
      } catch (error) {
        console.error('เกิดข้อผิดพลาดในการเชื่อมต่อ:', error);
        toast.error('เกิดข้อผิดพลาดในการเชื่อมต่อ กรุณาลองใหม่อีกครั้ง', {
          duration: 3000
        });
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
