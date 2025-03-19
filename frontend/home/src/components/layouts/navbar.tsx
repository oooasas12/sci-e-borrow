"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { IoIosArrowDown, IoMdMenu } from "react-icons/io";
import { FaChartBar, FaUser } from "react-icons/fa6";
import {
  FaCog,
  FaExchangeAlt,
  FaListAlt,
  FaSignOutAlt,
  FaTools,
} from "react-icons/fa";
import Link from "next/link";
import { HiArchive } from "react-icons/hi";
import { useSelector, useDispatch } from "react-redux";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@radix-ui/react-dropdown-menu";
import { logout } from "@/store/features/authSlice";
import Cookies from "js-cookie";
// type SidebarData = {
// };

export const Navbar = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const user = useSelector((state: any) => state.auth.user);
  const [openMenu, setOpenMenu] = useState<number[]>([]);
  const [isWithinTime, setIsWithinTime] = useState<boolean>(false);
  
  useEffect(() => {
    const checkCurrentTime = async () => {
      try {
        const currentDate = new Date().toISOString().split('T')[0];
        const currentTime = new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' });
        
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/set-time/check?current_date=${currentDate}&current_time=${currentTime}`);
        const data = await response.json();
        
        setIsWithinTime(data.is_within_time);
      } catch (error) {
        console.error('Error checking time:', error);
        setIsWithinTime(false);
      }
    };

    checkCurrentTime();
    // ตรวจสอบทุก 30 นาที
    const interval = setInterval(checkCurrentTime, 1800000);
    return () => clearInterval(interval);
  }, []);

  const HomePage = () => {
    router.push("/");
  };
  const [openMenuReport, setOpenMenuReport] = useState<boolean>(false);

  const handleOpenMenu = (index: number) => {
    if (openMenu.includes(index)) {
      setOpenMenu(openMenu.filter((item) => item !== index));
    } else {
      setOpenMenu([...openMenu, index]);
    }
  };
  
  const handleOpenMenuReport = () => {
    if (openMenuReport) {
      setOpenMenuReport(false);
    } else {
      setOpenMenuReport(true);
    }
  };

  const handleLogout = () => {
    window.location.href = "/login";
    dispatch(logout());
    Cookies.remove("auth_token");
    Cookies.remove("user_data");
    Cookies.remove("session_id");
  };

  const menu = [
    {
      menu: "จัดการ",
      icon: <FaCog />,
      subMenu: [
        {
          name: "ผู้ใช้งาน",
          link: "/admin/user",
        },
        {
          name: "รายการครุภัณฑ์",
          link: "/admin/equipment",
        },
        {
          name: "รายการชื่อครุภัณฑ์",
          link: "/admin/equipment-name",
        },
        {
          name: "ประเภทครุภัณฑ์",
          link: "/admin/equipment-type",
        },
        {
          name: "สาขา",
          link: "/admin/group-branch",
        },
        {
          name: "ตั้งเวลารักษาการแทน",
          link: "/admin/set-time",
        },
        {
          name: "หน่วยนับ",
          link: "/admin/unit",
        },
        {
          name: "แหล่งเงิน",
          link: "/admin/budget-source",
        },
        {
          name: "ตำแหน่งระดับคณะ",
          link: "/admin/position-fac",
        },
        {
          name: "ตำแหน่งระดับสาขา",
          link: "/admin/position-branch",
        },

        {
          name: "รายการการยืม-คืน",
          link: "/admin/equipment-bow",
        },
        {
          name: "รายการครุภัณฑ์ชำรุด",
          link: "/admin/equipment-broken",
        },
      ],
    },
  ];
  const [openNavbar, setOpenNavbar] = useState<boolean>(false);
  const handleOpenNavbar = () => {
    if (openNavbar) {
      setOpenNavbar(false);
    } else {  
      setOpenNavbar(true);
      document.body.style.overflow = "hidden";
    }
  };
  return (
    <div className={`my-scroll navbar  break-words bg-primary_1 w-screen overflow-hidden transition-all duration-300 ease-in-out ${openNavbar ? "h-screen" : "h-[80px]"}`}>
      <div className=" flex flex-col justify-between h-full">
        <div className="flex flex-col gap-2 h-full">
          <div className="relative flex flex-row items-center px-6 py-4 ">
            <div className="flex items-center gap-4">
              <img src="/images/logo-sci.png" className="size-[40px]" alt="" />
              <span className="text-sm text-white">
                ระบบยืม-คืนครุภัณฑ์ <br /> คณะวิทยาศาตร์และเทคโนโลยี
              </span>
            </div>
            <IoMdMenu className="ml-auto size-8 cursor-pointer text-primary_2 " onClick={() => handleOpenNavbar()} />
          </div>
          <div className={`relative h-full w-full flex-col overflow-auto py-6 flex ${openNavbar ? "block" : "hidden"}`}>
            <div className=" flex flex-col">
              {(user.position_fac.id === 2 || user.position_fac.id === 3) && (
                <div className="flex flex-col gap-2">
                  <div className="flex flex-col gap-2">
                    <div
                      className="flex cursor-pointer items-center justify-between p-6 hover:bg-dark"
                      onClick={() => handleOpenMenuReport()}
                    >
                      <span className="flex items-center gap-2 text-white">
                        <FaChartBar /> รายงาน
                      </span>
                      <IoIosArrowDown
                        className={`text-white transition-all duration-500 ease-in-out ${openMenuReport ? "rotate-180" : ""}`}
                      />
                    </div>
                    <div
                      className={`mx-4 flex h-full flex-col overflow-hidden rounded bg-white text-sm transition-all duration-300 ease-in-out ${openMenuReport ? "my-2 max-h-screen" : "max-h-0"}`}
                    >
                      <Link
                        href={{
                          pathname: "/admin/dashboard",
                        }}
                        className="cursor-pointer p-2 text-dark hover:bg-gray-100"
                      >
                        หน้าหลัก
                      </Link>
                      <Link
                        href={{
                          pathname: "/admin/dashboard/equipment-unable",
                        }}
                        className="cursor-pointer p-2 text-dark hover:bg-gray-100"
                      >
                        รายงานครุภัณฑ์ไม่สามารถใช้งานได้
                      </Link>
                      <Link
                        href={{
                          pathname: "/admin/dashboard/equipment-lost",
                        }}
                        className="cursor-pointer p-2 text-dark hover:bg-gray-100"
                      >
                        รายงานครุภัณฑ์สูญหาย
                      </Link>
                    </div>
                  </div>
                </div>
              )}
              {(user.position_fac.id == 3 ||
                user.position_fac.id == 1 ||
                user.position_fac.id == 2) &&
                menu.map((menu, index) => (
                  <div className="flex flex-col gap-2" key={index}>
                    <div
                      className="flex cursor-pointer items-center justify-between px-6 py-2 hover:bg-dark"
                      onClick={() => handleOpenMenu(index)}
                    >
                      <span className="flex items-center gap-2 text-white">
                        {menu.icon} {menu.menu}
                      </span>
                      <IoIosArrowDown
                        className={`text-white transition-all duration-500 ease-in-out ${openMenu.includes(index) ? "rotate-180" : ""}`}
                      />
                    </div>
                    <div
                      className={`mx-6 flex h-full flex-col overflow-hidden rounded bg-white text-sm transition-all duration-300 ease-in-out ${openMenu.includes(index) ? "my-2 max-h-screen" : "max-h-0"}`}
                    >
                      {menu.subMenu.map((subMenu, index) => (
                        <Link
                          key={index}
                          href={{
                            pathname: subMenu.link,
                          }}
                          className="cursor-pointer p-2 text-dark hover:bg-gray-100"
                        >
                          {subMenu.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}

              {(user.position_branch.id == 2 ||
                user.position_fac.id == 2 ||
                (user.position_fac.id == 3 && isWithinTime)) && (
                <div className="flex flex-col gap-2">
                  <Link
                    href={{
                      pathname: "/approval/equipment-bow",
                    }}
                    className="flex items-center gap-2 px-4 py-2 text-white hover:bg-dark"
                  >
                    <FaListAlt /> อนุมัติการยืม-คืน
                  </Link>
                  <Link
                    href={{
                      pathname: "/approval/equipment-broken",
                    }}
                    className="flex items-center gap-2 px-4 py-2 text-white hover:bg-dark"
                  >
                    <HiArchive /> ประวัติการแจ้งครุภัณฑ์ชำรุด
                  </Link>
                </div>
              )}
              {user.position_branch.id != 5 &&
                user.position_fac.id != 1 &&
                user.position_fac.id != 2 &&
                user.position_fac.id != 3 &&
                user.position_branch.id != 2 && (
                  <div className="flex flex-col gap-2">
                    <Link
                      href={{
                        pathname: "/user/equipment-bow",
                      }}
                      className="flex items-center gap-2 px-4 py-2 text-white hover:bg-dark"
                    >
                      <FaExchangeAlt /> แจ้งการยืม-คืน
                    </Link>
                    <Link
                      href={{
                        pathname: "/user/equipment-broken",
                      }}
                      className="flex items-center gap-2 px-4 py-2 text-white hover:bg-dark"
                    >
                      <FaTools /> แจ้งการครุภัณฑ์ชำรุด
                    </Link>
                  </div>
                )}
            </div>
          </div>
        </div>
        <div className={`flex flex-col justify-end mt-auto h-full ${openNavbar ? "block" : "hidden"}`}>
          <DropdownMenu>
            <DropdownMenuTrigger className="w-full">
              <div className="flex cursor-pointer flex-col gap-2">
                <div className="flex items-center gap-2 px-4 py-2 text-white">
                  <div className="flex items-center justify-center rounded-full bg-gray-300 px-6 py-4">
                    <span className="text-2xl font-bold">
                      {user.name ? user.name.charAt(0).toUpperCase() : ""}
                    </span>
                  </div>
                  <div className="flex flex-col items-start">
                    <span className="text-base text-white">
                      {user.name ? user.name : ""}
                    </span>
                    <span className="text-xs text-gray-400">
                      {user.position_branch.name}
                    </span>
                  </div>
                </div>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="min-w-[200px] rounded-md bg-white p-2 shadow-lg">
              <DropdownMenuItem className="cursor-pointer rounded-md p-2 hover:bg-gray-100">
                <Link href="/profile">โปรไฟล์</Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={handleLogout}
                className="cursor-pointer rounded-md p-2 hover:bg-gray-100"
              >
                ล็อคเอ้าท์
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
