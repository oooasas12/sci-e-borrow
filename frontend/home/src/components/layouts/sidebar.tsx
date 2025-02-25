"use client";

import React, { useState } from "react";
import { useRouter } from 'next/navigation'
import { IoMdMenu } from "react-icons/io";
import { FaChartBar, FaUser } from "react-icons/fa6";
import { FaCog, FaListAlt } from "react-icons/fa";
import Link from "next/link";
import { HiArchive } from "react-icons/hi";

// type SidebarData = {
// };

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

    const menu = [
        {
            menu: 'รายงาน',
            icon: <FaChartBar />,
            subMenu: [
                
            ]
        },
        {
            menu: 'จัดการ',
            icon: <FaCog />,
            subMenu: [
                {
                    name: 'ผู้ใช้งาน',
                    link: '/admin/user'
                },
                {
                    name: 'รายการครุภัณฑ์',
                    link: '/admin/equipment'
                },
                {
                    name: 'รายการชื่อครุภัณฑ์',
                    link: '/admin/equipment-name'
                },
                {
                    name: 'ประเภทครุภัณฑ์',
                    link: '/admin/equipment-type'
                },
                {
                    name: 'สาขา',
                    link: '/admin/group-branch'
                },
                {
                    name: 'ตั้งเวลารักษาการแทน',
                    link: '/admin/set-time'
                },
                {
                    name: 'หน่วยนับ',
                    link: '/admin/unit'
                },
                {
                    name: 'แหล่งเงิน',
                    link: '/admin/budget-source'
                },
                {
                    name: 'ตำแหน่งระดับคณะ',
                    link: '/admin/position-fac'
                },
                {
                    name: 'ตำแหน่งระดับสาขา',
                    link: '/admin/position-branch'
                }
            ]
        },
        {
            menu: 'ดำเนินการครุภัณฑ์',
            icon: <HiArchive />,
            subMenu: [
                {
                    name: 'รายงานการยีม-คืน',
                    link: '/equipment-bow'
                },
                {
                    name: 'รายการครุภัณฑ์ชำรุด',
                    link: '/equipment-broken'
                }
            ]
        }
    ]
    return (
        <div className="bg-primary_1 fixed top-0 lg:relative break-words lg:min-h-screen lg:w-64 w-full my-scroll">
            <div className=" relative px-6 py-4 flex flex-row items-center lg:hidden">
                <div className="flex gap-4 items-center ">
                    <img src="/images/logo-sci.png" className=" size-[40px] " alt="" />
                    <span className="text-sm text-white">ระบบยืม-คืนครุภัณฑ์ <br /> คณะวิทยาศาตร์และเทคโนโลยี</span>
                </div>
                <IoMdMenu className="text-primary_2 size-8 ml-auto cursor-pointer lg:hidden" />
            </div>
            <div className=" h-screen w-64 relative  py-6 lg:flex flex-col hidden overflow-auto">
                <div className="flex gap-4 px-4 items-center w-full">
                    <img src="/images/logo-sci.png" className=" size-[40px] " alt="" />
                    <span className="text-sm text-white">ระบบยืม-คืนครุภัณฑ์ <br /> คณะวิทยาศาตร์และเทคโนโลยี</span>
                </div>
                <div className="flex flex-col mt-8 ">
                    {menu.map((menu, index) => (
                        <div className="flex flex-col gap-2 " key={index}>
                            <span className="flex gap-2 items-center text-white py-2 px-4 hover:bg-dark cursor-pointer" onClick={() => handleOpenMenu(index)}>{menu.icon} {menu.menu}</span>
                            <div className={`h-full  transition-all mx-4 bg-white rounded text-sm duration-300 ease-in-out overflow-hidden flex flex-col  ${openMenu.includes(index) ? 'max-h-screen my-2' : 'max-h-0'}`}>
                                {menu.subMenu.map((subMenu, index) => (
                                    <Link
                                        key={index}
                                        href={{
                                            pathname: subMenu.link
                                        }}
                                        className="text-dark hover:bg-gray-100 p-2 cursor-pointer"
                                    >
                                        {subMenu.name}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

        </div>
    );
};

export default Sidebar;
