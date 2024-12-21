"use client";
import Image from "next/image";
import Layout from "@/Layouts/default"
import { useState } from "react";
import ButtonPrimary from "@/components/button/buttonPrimary";
import { FaUser } from "react-icons/fa6";
import { FiLogIn } from "react-icons/fi";
import { useRouter } from "next/navigation";

export default function Login() {
  const router = useRouter();
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleClick = () => {
    if (username && password) {
      console.log("username: ", username)
      console.log("password: ", password)

      router.push('/report')
    }else {
      console.log("กรุณากรอกข้อมูลให้ครบถ้วน")
    }
  }

  return (
    <div className="bg-primary_1 min-h-screen overflow-hidden">
      <div className="h-screen w-full overflow-auto">
        <div className="mx-auto flex items-center h-full md:px-[40px] lg:w-[920px] ">
          <div className="container mx-auto h-full md:h-fit">
            <div className="flex bg-bg_1 rounded-lg h-full md:h-fit lg:min-h-[400px]">
              <div className="w-1/3 hidden lg:block">
                <img src="/images/600x400.png" className=" rounded-l-lg h-full object-cover" alt="" />
              </div>
              <div className="w-full lg:w-2/3 ">
                <div className="flex gap-8 flex-col p-8 h-full justify-center">
                  <div className="flex gap-4 items-center">
                    <img src="/images/logo-sci.png" className=" size-[80px] " alt="" />
                    <span className="md:text-xl">ระบบยืม-คืนครุภัณฑ์ <br /> คณะวิทยาศาตร์และเทคโนโลยี</span>
                  </div>
                  <div className="flex flex-col gap-2 ">
                    <span className="text-sm">Username</span>
                    <input type="text" onChange={event => setUsername(event.target.value)} className=" rounded-lg border-black border hover:bg-gray-50 px-2 h-10 focus:outline-primary_1" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <span className="text-sm">Password</span>
                    <input type="password" onChange={event => setPassword(event.target.value)} className=" rounded-lg border-black border hover:bg-gray-50 px-2 h-10 focus:outline-primary_1" />
                  </div>
                  <ButtonPrimary onClick={handleClick} data="เข้าสู่ระบบ" size="medium" className="ml-auto" icon={<FiLogIn />} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
