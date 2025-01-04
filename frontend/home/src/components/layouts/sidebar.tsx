"use client";

import React, { useState } from "react";
import { useRouter } from 'next/navigation'
import { IoMdMenu } from "react-icons/io";
import { FaUser } from "react-icons/fa6";
import { FaListAlt } from "react-icons/fa";
import Link from "next/link";

type SidebarData = {
};

export const Sidebar = () => {
    const router = useRouter();
    const [openMenu, setOpenMenu] = useState<number[]>([]);
    const HomePage = () => {
        router.push('/');
    }

    const handleOpenMenu = (index: number) => {
        if (openMenu.includes(index)) {
            setOpenMenu(openMenu.filter((item) => item !== index));
        } else {
            setOpenMenu([...openMenu, index]);
        }
    }
    return (
        <div className="bg-primary_1 fixed top-0 lg:relative break-words lg:min-h-screen lg:w-64 w-full">
            <div className=" relative px-6 py-4 flex flex-row items-center lg:hidden">
                <div className="flex gap-4 items-center ">
                    <img src="/images/logo-sci.png" className=" size-[40px] " alt="" />
                    <span className="text-sm text-white">ระบบยืม-คืนครุภัณฑ์ <br /> คณะวิทยาศาตร์และเทคโนโลยี</span>
                </div>
                <IoMdMenu className="text-primary_2 size-8 ml-auto cursor-pointer lg:hidden" />
            </div>
            <div className=" h-screen w-64 relative  py-6 lg:flex flex-col hidden">
                <div className="flex gap-4 px-4 items-center w-full">
                    <img src="/images/logo-sci.png" className=" size-[40px] " alt="" />
                    <span className="text-sm text-white">ระบบยืม-คืนครุภัณฑ์ <br /> คณะวิทยาศาตร์และเทคโนโลยี</span>
                </div>
                <div className="flex flex-col mt-8 ">
                    <Link href={{
                        pathname: '/admin/report'
                    }}
                        className="flex gap-2 py-2 px-4 hover:bg-dark items-center text-white cursor-pointer"><FaListAlt /> รายงานการยีม-คืน</Link>
                    <div className="flex flex-col gap-2 ">
                        <span className="flex gap-2 items-center text-white py-2 px-4 hover:bg-dark cursor-pointer" onClick={() => handleOpenMenu(2)}><FaUser /> จัดการ</span>
                        <div className={`h-full  transition-all mx-4 bg-white rounded text-sm duration-300 ease-in-out overflow-hidden flex flex-col  ${openMenu.includes(2) ? 'max-h-screen my-2' : 'max-h-0'}`}>
                            <Link
                                href={{
                                    pathname: '/admin/user'
                                }}
                                className="text-dark hover:bg-gray-100 p-2 cursor-pointer"
                            >
                                ผู้ใช้งาน
                            </Link>
                            <span className="text-dark hover:bg-gray-100 p-2 cursor-pointer">ครุภัณฑ์</span>
                        </div>
                    </div>
                    <span className="flex gap-2 py-2 px-4 hover:bg-dark items-center text-white cursor-pointer" onClick={() => handleOpenMenu(1)} ><FaUser /> ครุภัณฑ์</span>
                </div>
            </div>

        </div>
    );
};

export default Sidebar;
